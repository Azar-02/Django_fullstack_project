"""Groq tool-calling orchestration for Tea Palace's AI Shopping Agent."""
import json
import logging
import os
import re

from groq import Groq

from . import tools as shopping_tools

logger = logging.getLogger(__name__)
MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-20b")
MAX_TOOL_ROUNDS = 3


SYSTEM_PROMPT = """You are the Tea Palace AI Shopping Assistant.

Tea Palace sells hot beverages, cold beverages, and snacks.
Help customers discover products, compare choices, and build budget-friendly combinations.

Rules:

- Use catalogue tools for product names, prices, categories, descriptions, and availability.
- Never invent products, prices, discounts, stock, or order details.
- Prices returned by tools are authoritative and are in Indian rupees (INR).
- For budget requests, use find_budget_combinations and explain the total and remaining budget.
- For general product recommendations, use search_products with available_only=true.
- For a specific product request, first search with available_only=true.
- If the requested product is not found, search again using the same query with available_only=false.
- If the second search finds the product with available=false, clearly say that the product exists but is currently unavailable.
- Never say a product does not exist just because it was not found in the available-products search.
- Suggest similar products only if they are actually available in the catalogue.
- Never prepare an add-to-cart proposal for an unavailable product.
- Be friendly, concise, and helpful.
- If a product is not found even when searching with available_only=false, honestly say it is not in the catalogue.
"""



def _tool_schema(name, description, properties, required=None):
    return {
        "type": "function",
        "function": {
            "name": name,
            "description": description,
            "parameters": {
                "type": "object",
                "properties": properties,
                "required": required or [],
            },
        },
    }


TOOLS = [
    _tool_schema(
        "search_products",
        "Search the Tea Palace catalogue by keyword, category, and optional maximum price. Set available_only=true for available products or false to include unavailable products.",
        {
            "query": {"type": "string", "description": "Product or ingredient keyword; use an empty string to browse."},
            "category": {"type": "string", "description": "Optional category name such as hot beverages, cold beverages, or snacks."},
            "max_price": {"type": "number", "description": "Optional maximum price in INR."},
            "available_only": {"type": "boolean", "description": "Whether to include only currently available products."},
        },
        ["query"],
    ),
    _tool_schema(
        "find_budget_combinations",
        "Find real combinations of two or three available products that fit within a customer's total INR budget.",
        {
            "budget": {"type": "number", "description": "The customer's total budget in INR."},
            "category": {"type": "string", "description": "Optional category filter."},
            "max_items": {"type": "integer", "description": "Maximum number of different products in a combination (2 or 3)."},
        },
        ["budget"],
    ),
    _tool_schema(
        "get_product_details",
        "Get the latest details of one product using its database ID.",
        {"product_id": {"type": "integer", "description": "The product database ID."}},
        ["product_id"],
    ),
]

TOOLS.append(
    _tool_schema(
        "get_cart_summary",
        "Read the signed-in customer's current cart items and total. Never read another user's cart.",
        {},
    )
)

TOOLS.append(
    _tool_schema(
        "get_order_history",
        "Retrieve the signed-in customer's recent orders, including order IDs, dates, products, quantities and totals. Never access another user's orders.",
        {
            "limit": {
                "type": "integer",
                "description": "Number of recent orders to retrieve, from 1 to 10. Default is 5."
            }
        },
        []
    )
)

TOOLS.append(
    _tool_schema(
        "prepare_cart_addition",
        "Prepare an add-to-cart proposal for a product. This tool does not modify the cart; the customer must confirm in the UI.",
        {
            "product_id": {"type": "integer", "description": "The product database ID."},
            "quantity": {"type": "integer", "description": "Quantity from 1 to 10."},
        },
        ["product_id"],
    )
)


def _search_products_with_fallback(request, **kwargs):
    result = shopping_tools.search_products(
        request=request,
        **kwargs,
    )

    if kwargs.get("available_only", True) and not result.get("products"):
        fallback_kwargs = {
            **kwargs,
            "available_only": False,
        }

        fallback = shopping_tools.search_products(
            request=request,
            **fallback_kwargs,
        )

        if fallback.get("products"):
            fallback["availability_fallback"] = True
            return fallback

    return result


def _build_tool_functions(request):
    functions = {
        "search_products": lambda **kwargs: _search_products_with_fallback(
            request=request,
            **kwargs
        ),
        "find_budget_combinations": lambda **kwargs: shopping_tools.find_budget_combinations(request=request, **kwargs),
        "get_product_details": lambda **kwargs: shopping_tools.get_product_details(request=request, **kwargs),
    }

    if request.user.is_authenticated:
        functions["get_cart_summary"] = lambda **kwargs: shopping_tools.get_cart_summary(request.user)
        functions["prepare_cart_addition"] = lambda **kwargs: shopping_tools.prepare_cart_addition(request=request, **kwargs)
        functions["get_order_history"] = lambda **kwargs: shopping_tools.get_order_history(
            request.user,
            **kwargs
        )

    return functions


def _collect_products(tool_name, result, collected):
    candidates = []
    if tool_name == "search_products":
        candidates = result.get("products", [])
    elif tool_name == "get_product_details" and result.get("product"):
        candidates = [result["product"]]
    elif tool_name == "find_budget_combinations":
        for combo in result.get("combinations", []):
            candidates.extend(combo.get("items", []))
    elif tool_name == "prepare_cart_addition" and result.get("pending_action"):
        candidates = [result["pending_action"]["product"]]

    known_ids = {item["id"] for item in collected}
    for product in candidates:
        if product["id"] not in known_ids:
            collected.append(product)
            known_ids.add(product["id"])


def _collect_pending_actions(result, pending_actions):
    action = result.get("pending_action")
    if action:
        pending_actions.append(action)


def _safe_history(history):
    messages = []
    if not isinstance(history, list):
        return messages

    for item in history[-8:]:
        if not isinstance(item, dict):
            continue
        role = item.get("role")
        content = item.get("content")
        if role in ("user", "assistant") and isinstance(content, str):
            content = content.strip()[:2000]
            if content:
                messages.append({"role": role, "content": content})
    return messages


def run_shopping_agent(message, history, request):
    # Do not ask the LLM to handle cart operations for anonymous users.
    # This deterministic guard also prevents GPT from emitting a tool call
    # whose schema was intentionally omitted from the anonymous request.
    if not request.user.is_authenticated and re.search(r"\bcart\b", message, re.IGNORECASE):
        return {
            "reply": "Please log in to view or modify your cart. You can still browse products and get recommendations without logging in.",
            "products": [],
            "pending_actions": [],
            "tool_activity": [],
            "requires_login": True,
        }

    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise RuntimeError("GROQ_API_KEY is not configured in backend/.env")

    client = Groq(api_key=api_key, timeout=35.0)
    system_prompt = SYSTEM_PROMPT
    if request.user.is_authenticated:
        system_prompt += """
The customer is signed in. You may use get_cart_summary for their cart questions.
Use get_order_history for questions about previous orders, order IDs, dates, items, quantities and totals.
Only report order information returned by the tool. Do not invent an order status.
For add-to-cart requests, use prepare_cart_addition to create a proposal only.
It does NOT modify the cart. Clearly ask the customer to confirm the proposal in the UI.
Never claim an item was added until the application confirms the cart API succeeded.
"""
    else:
        system_prompt += """
The customer is NOT signed in. Cart tools are unavailable.
Do not attempt any cart tool calls. If the customer asks about viewing or changing a cart,
explain that they must log in first. You may still search and recommend catalogue products.
"""

    messages = [{"role": "system", "content": system_prompt}]
    messages.extend(_safe_history(history))
    messages.append({"role": "user", "content": message.strip()[:2000]})

    available_functions = _build_tool_functions(request)
    available_schemas = [
        schema for schema in TOOLS
        if schema["function"]["name"] in available_functions
    ]

    products = []
    pending_actions = []
    tool_activity = []

    for _ in range(MAX_TOOL_ROUNDS):
        response = client.chat.completions.create(
            model=MODEL,
            messages=messages,
            tools=available_schemas,
            tool_choice="auto",
            temperature=0.2,
            max_completion_tokens=1200,
        )
        assistant_message = response.choices[0].message
        tool_calls = assistant_message.tool_calls or []

        messages.append(assistant_message.model_dump(exclude_none=True))
        if not tool_calls:
            return {
                "reply": assistant_message.content or "I couldn't create a response. Please try again.",
                "products": products,
                "pending_actions": pending_actions,
                "tool_activity": tool_activity,
            }

        for tool_call in tool_calls:
            name = tool_call.function.name
            try:
                arguments = json.loads(tool_call.function.arguments or "{}")
                function = available_functions.get(name)
                if function is None:
                    result = {"error": "This action is not available."}
                else:
                    result = function(**arguments)
                    _collect_products(name, result, products)
                    _collect_pending_actions(result, pending_actions)
                tool_activity.append(name)
            except (TypeError, ValueError, json.JSONDecodeError) as error:
                logger.warning("Invalid arguments for assistant tool %s: %s", name, error)
                result = {"error": "I couldn't process that request. Please try again with more details."}
            except Exception:
                logger.exception("Assistant tool %s failed", name)
                result = {"error": "The catalogue service had a problem. Please try again."}

            messages.append({
                "role": "tool",
                "tool_call_id": tool_call.id,
                "name": name,
                "content": json.dumps(result, ensure_ascii=False, default=str),
            })

    final_response = client.chat.completions.create(
        model=MODEL,
        messages=messages,
        tools=available_schemas,
        tool_choice="none",
        temperature=0.2,
        max_completion_tokens=1200,
    )
    return {
        "reply": final_response.choices[0].message.content or "I found some options. Please review the results below.",
        "products": products,
        "pending_actions": pending_actions,
        "tool_activity": tool_activity,
    }

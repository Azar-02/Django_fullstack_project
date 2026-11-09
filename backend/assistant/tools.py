"""Database tools used by the T Palace Groq shopping agent.

These functions run inside Django. Product prices and availability always come
from the database; the language model never supplies authoritative values.
"""
from decimal import Decimal, InvalidOperation
from itertools import combinations

from django.db.models import Q

from cart.models import Cart
from orders.models import Order
from products.models import Product


def _product_payload(product, request=None):
    image = ""
    if product.image:
        image = product.image.url
        if request is not None:
            image = request.build_absolute_uri(image)

    return {
        "id": product.id,
        "name": product.name,
        "description": product.description,
        "price": str(product.price),
        "category": product.category.name,
        "image": image,
        "available": product.available,
    }


def search_products(query="", category="", max_price=None, available_only=True, request=None):
    """Search the real product catalogue by name, description, or category."""
    products = Product.objects.select_related("category").all()

    if available_only:
        products = products.filter(available=True)

    query = (query or "").strip()
    if query:
        products = products.filter(
            Q(name__icontains=query)
            | Q(description__icontains=query)
            | Q(category__name__icontains=query)
        )

    category = (category or "").strip()
    if category:
        products = products.filter(category__name__icontains=category)

    if max_price not in (None, ""):
        try:
            price_limit = Decimal(str(max_price))
            if price_limit < 0:
                return {"error": "max_price must be zero or greater.", "products": []}
            products = products.filter(price__lte=price_limit)
        except (InvalidOperation, ValueError):
            return {"error": "max_price must be a valid number.", "products": []}

    products = list(products.order_by("price", "name")[:8])
    return {
        "count": len(products),
        "products": [_product_payload(product, request) for product in products],
    }


def find_budget_combinations(budget, category="", max_items=3, request=None):
    """Return real catalogue combinations that stay within the user's budget."""
    try:
        budget_value = Decimal(str(budget))
    except (InvalidOperation, ValueError):
        return {"error": "Please provide a valid budget amount.", "combinations": []}

    if budget_value <= 0:
        return {"error": "Budget must be greater than zero.", "combinations": []}

    max_items = max(2, min(int(max_items), 3))
    queryset = Product.objects.select_related("category").filter(
        available=True,
        price__lte=budget_value,
    )
    if category:
        queryset = queryset.filter(category__name__icontains=category.strip())

    candidates = list(queryset.order_by("price", "name")[:24])
    found = []

    for item_count in range(2, max_items + 1):
        for group in combinations(candidates, item_count):
            total = sum((item.price for item in group), Decimal("0.00"))
            if total <= budget_value:
                found.append((total, group))

    found.sort(key=lambda entry: entry[0], reverse=True)
    results = []
    for total, group in found[:5]:
        results.append({
            "items": [_product_payload(product, request) for product in group],
            "total": str(total),
            "remaining_budget": str(budget_value - total),
        })

    return {
        "budget": str(budget_value),
        "combinations": results,
        "message": "No two-or-more-item combination fits this budget." if not results else "",
    }


def get_product_details(product_id, request=None):
    """Fetch a single product's current details from the database."""
    try:
        product = Product.objects.select_related("category").get(pk=int(product_id))
    except (Product.DoesNotExist, TypeError, ValueError):
        return {"error": "That product could not be found."}
    return {"product": _product_payload(product, request)}


def get_cart_summary(user):
    """Read only the authenticated user's own cart."""
    if not user or not user.is_authenticated:
        return {"error": "Please log in to view your cart."}

    try:
        cart = Cart.objects.prefetch_related("items__product__category").get(user=user)
    except Cart.DoesNotExist:
        return {"items": [], "total": "0.00", "message": "Your cart is empty."}

    items = []
    total = Decimal("0.00")
    for item in cart.items.all():
        subtotal = item.product.price * item.quantity
        total += subtotal
        items.append({
            "product_id": item.product_id,
            "name": item.product.name,
            "quantity": item.quantity,
            "unit_price": str(item.product.price),
            "subtotal": str(subtotal),
        })

    return {"items": items, "total": str(total), "message": "" if items else "Your cart is empty."}


def prepare_cart_addition(product_id, quantity=1, request=None):
    """Prepare an add-to-cart suggestion; this function never changes the cart."""
    try:
        product = Product.objects.select_related("category").get(pk=int(product_id))
        quantity = int(quantity)
    except (Product.DoesNotExist, TypeError, ValueError):
        return {"error": "I could not find that product."}

    if not product.available:
        return {"error": f"{product.name} is currently unavailable."}
    if quantity < 1 or quantity > 10:
        return {"error": "Please choose a quantity between 1 and 10."}

    product_data = _product_payload(product, request)
    return {
        "requires_confirmation": True,
        "pending_action": {
            "type": "add_to_cart",
            "product": product_data,
            "quantity": quantity,
            "subtotal": str(product.price * quantity),
        },
        "message": "Ask the customer to confirm before adding this item. Do not claim it has been added yet.",
    }


def get_order_history(user, limit=5):
    """Read only the authenticated user's recent orders."""

    if not user or not user.is_authenticated:
        return {"error": "Please log in to view your orders."}

    try:
        limit = max(1, min(int(limit), 10))
    except (TypeError, ValueError):
        limit = 5

    orders = (
        Order.objects
        .filter(user=user)
        .prefetch_related("items__product")
        .order_by("-created_at")[:limit]
    )

    results = []

    for order in orders:
        items = []

        for item in order.items.all():
            items.append({
                "product": item.product.name,
                "quantity": item.quantity,
                "unit_price": str(item.price),
                "subtotal": str(item.price * item.quantity),
            })

        results.append({
            "order_id": order.id,
            "created_at": order.created_at.isoformat(),
            "items": items,
            "total": str(order.total),
        })

    return {
        "count": len(results),
        "orders": results,
        "message": "" if results else "You have no previous orders.",
    }
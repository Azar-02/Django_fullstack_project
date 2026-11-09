
import { useState } from "react";
import api from "../api/axios";
import "./FloatingAssistant.css";
import AIResponse from "./AIResponse";


function decodeHtmlEntities(value) {
    const entities = {
        amp: "&",
        lt: "<",
        gt: ">",
        quot: '"',
        apos: "'",
        nbsp: " ",
    };

    return String(value ?? "").replace(
        /&(#(?:x[0-9a-f]+|\d+)|amp|lt|gt|quot|apos|nbsp);/gi,
        (match, entity) => {
            if (entity.startsWith("#")) {
                const isHex = entity[1].toLowerCase() === "x";
                const code = parseInt(
                    entity.slice(isHex ? 2 : 1),
                    isHex ? 16 : 10
                );

                return Number.isFinite(code) && code >= 0 && code <= 0x10FFFF
                    ? String.fromCodePoint(code)
                    : match;
            }

            return entities[entity.toLowerCase()] ?? match;
        }
    );
}


function FloatingAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            text: "Hi! Welcome to Tea Palace. How can I help you today?",
        },
    ]);
    const [products, setProducts] = useState([]);
    const [pendingActions, setPendingActions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [confirming, setConfirming] = useState(false);

    const sendMessage = async (event) => {
        event.preventDefault();

        if (!message.trim() || loading) return;

        const userMessage = message.trim();

        setMessages((previous) => [
            ...previous,
            { role: "user", text: userMessage },
        ]);

        setMessage("");
        setLoading(true);
        setProducts([]);
        setPendingActions([]);

        try {
            const response = await api.post("assistant/chat/", {
                message: userMessage,
            });

            setMessages((previous) => [
                ...previous,
                {
                    role: "assistant",
                    text: response.data.reply,
                },
            ]);

            setProducts(
                (response.data.products || []).filter(
                    (product) => product.available === true
                )
            );
            setPendingActions(response.data.pending_actions || []);
        } catch (error) {
            setMessages((previous) => [
                ...previous,
                {
                    role: "assistant",
                    text:
                        error.response?.data?.detail ||
                        "Sorry, something went wrong. Please try again.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const confirmAddToCart = async () => {
        if (!pendingActions.length || confirming) return;

        setConfirming(true);

        try {
            for (const action of pendingActions) {
                if (action.type !== "add_to_cart") continue;

                await api.post("cart/add/", {
                    product_id: action.product.id,
                    quantity: action.quantity,
                });
            }

            setPendingActions([]);

            setMessages((previous) => [
                ...previous,
                {
                    role: "assistant",
                    text: "Successfully added the confirmed items to your cart!",
                },
            ]);
        } catch (error) {
            setMessages((previous) => [
                ...previous,
                {
                    role: "assistant",
                    text:
                        error.response?.data?.detail ||
                        "Unable to update your cart. Please check your cart before retrying.",
                },
            ]);
        } finally {
            setConfirming(false);
        }
    };

    const cancelAction = () => {
        setPendingActions([]);

        setMessages((previous) => [
            ...previous,
            {
                role: "assistant",
                text: "No problem! I cancelled the cart addition.",
            },
        ]);
    };

    return (
        <div className="floating-ai-container">

            {isOpen && (
                <div className="floating-ai-window">

                    <div className="floating-ai-header">
                        <div>
                            <strong>🤖 Tea Palace AI</strong>
                            <div className="small">
                                Your personal shopping assistant
                            </div>
                        </div>

                        <button
                            className="btn-close btn-close-white"
                            onClick={() => setIsOpen(false)}
                            aria-label="Close assistant"
                        />
                    </div>

                    <div className="floating-ai-body">

                        {messages.map((item, index) => (
                            <div
                                key={index}
                                className={`ai-message ${
                                    item.role === "user"
                                        ? "ai-user-message"
                                        : "ai-bot-message"
                                }`}
                            >
                                <AIResponse content={item.text} />
                            </div>
                        ))}

                        {products.length > 0 && (
                            <div className="ai-products">
                                <strong>Recommended Products</strong>
                                {products.map((product) => (
                                    <div className="ai-product-item">
                                        <span className="ai-product-name">
                                            {decodeHtmlEntities(product.name)}
                                        </span>

                                        <strong className="ai-product-price">
                                            ₹{product.price}
                                        </strong>
                                    </div>

                                ))}
                            </div>
                        )}

                        {pendingActions.length > 0 && (
                            <div className="ai-confirmation">
                                <strong>Confirm Cart Addition</strong>

                                {pendingActions.map((action, index) => (
                                    <div key={index} className="mt-2">
                                        {action.product.name} × {action.quantity}
                                        <div className="small">
                                            Subtotal: ₹{action.subtotal}
                                        </div>
                                    </div>
                                ))}

                                <div className="d-flex gap-2 mt-3">
                                    <button
                                        className="btn btn-success btn-sm"
                                        onClick={confirmAddToCart}
                                        disabled={confirming}
                                    >
                                        {confirming ? "Adding..." : "Confirm"}
                                    </button>

                                    <button
                                        className="btn btn-outline-secondary btn-sm"
                                        onClick={cancelAction}
                                        disabled={confirming}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {loading && (
                            <div className="ai-bot-message">
                                Thinking...
                            </div>
                        )}
                    </div>

                    <form
                        className="floating-ai-input"
                        onSubmit={sendMessage}
                    >
                        <input
                            type="text"
                            value={message}
                            onChange={(event) =>
                                setMessage(event.target.value)
                            }
                            placeholder="Ask me anything..."
                            disabled={loading}
                        />

                        <button
                            type="submit"
                            disabled={loading || !message.trim()}
                        >
                            Send
                        </button>
                    </form>

                </div>
            )}

            <button
                className="floating-ai-button"
                onClick={() => setIsOpen((previous) => !previous)}
                aria-label="Open AI assistant"
            >
                {isOpen ? "✕" : "🤖"}
            </button>

        </div>
    );
}

export default FloatingAssistant;

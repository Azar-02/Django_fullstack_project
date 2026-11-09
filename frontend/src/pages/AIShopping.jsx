
import { useState } from "react";
import api from "../api/axios";
import AIResponse from "../components/AIResponse";

function AIShopping() {
    const [message, setMessage] = useState("");
    const [reply, setReply] = useState("");
    const [products, setProducts] = useState([]);
    const [pendingActions, setPendingActions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [confirming, setConfirming] = useState(false);

    const sendMessage = async (event) => {
        event.preventDefault();

        if (!message.trim()) return;

        setLoading(true);
        setReply("");
        setProducts([]);
        setPendingActions([]);

        try {
            const response = await api.post("assistant/chat/", {
                message: message.trim(),
            });

            setReply(response.data.reply);
            setProducts(
                (response.data.products || []).filter(
                    (product) => product.available === true
                )
            );
            setPendingActions(response.data.pending_actions || []);

            if (response.data.requires_login) {
                setReply(response.data.reply);
            }
        } catch (error) {
            setReply(
                error.response?.data?.detail ||
                "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
            setMessage("");
        }
    };

    const confirmAddToCart = async () => {
        if (pendingActions.length === 0) return;

        setConfirming(true);

        try {
            for (const action of pendingActions) {
                if (action.type !== "add_to_cart") continue;

                await api.post("cart/add/", {
                    product_id: action.product.id,
                    quantity: action.quantity,
                });
            }

            setReply("Successfully added the confirmed items to your cart!");
            setPendingActions([]);
        } catch (error) {
            setReply(
                error.response?.data?.detail ||
                "Unable to add the items to your cart. Please try again."
            );
        } finally {
            setConfirming(false);
        }
    };

    return (
        <div className="container py-4">
            <div className="text-center mb-4">
                <h2>AI Shopping Assistant</h2>
                <p className="text-muted">
                    Find products, get recommendations and shop within your budget.
                </p>
            </div>

            <div className="card shadow-sm border-0">
                <div className="card-body p-4">
                    <form onSubmit={sendMessage}>
                        <label className="form-label fw-semibold">
                            What are you looking for?
                        </label>

                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Example: Suggest snacks under 150 rupees"
                                value={message}
                                onChange={(event) =>
                                    setMessage(event.target.value)
                                }
                                disabled={loading}
                            />

                            <button
                                className="btn btn-success"
                                type="submit"
                                disabled={loading || !message.trim()}
                            >
                                {loading ? "Thinking..." : "Ask AI"}
                            </button>
                        </div>
                    </form>

                    {loading && (
                        <p className="text-muted mt-3">
                            AI is checking our menu...
                        </p>
                    )}

                    {reply && (
                        <div className="alert alert-light border mt-4">
                            <strong>AI Assistant</strong>
                            <div className="mt-2">
                                <AIResponse content={reply} />
                            </div>
                        </div>
                    )}

                    {products.length > 0 && (
                        <div className="mt-4">
                            <h5>Recommended Products</h5>

                            <div className="row">
                                {products.map((product) => (
                                    <div
                                        className="col-md-4 mb-3"
                                        key={product.id}
                                    >
                                        <div className="card h-100">
                                            {product.image && (
                                                <img
                                                    src={product.image}
                                                    className="card-img-top"
                                                    alt={product.name}
                                                    style={{
                                                        height: "160px",
                                                        objectFit: "cover",
                                                    }}
                                                />
                                            )}

                                            <div className="card-body">
                                                <h6>{product.name}</h6>
                                                <p className="text-success fw-bold">
                                                    ₹{product.price}
                                                </p>
                                                <small className="text-muted">
                                                    {product.category}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {pendingActions.length > 0 && (
                        <div className="card border-success mt-4">
                            <div className="card-body">
                                <h5>Cart Addition Confirmation</h5>

                                {pendingActions.map((action, index) => (
                                    <div key={index} className="mb-3">
                                        <p className="mb-1">
                                            <strong>
                                                {action.product.name}
                                            </strong>
                                            {" "}× {action.quantity}
                                        </p>

                                        <p className="text-muted mb-0">
                                            Subtotal: ₹{action.subtotal}
                                        </p>
                                    </div>
                                ))}

                                <button
                                    className="btn btn-success"
                                    onClick={confirmAddToCart}
                                    disabled={confirming}
                                >
                                    {confirming
                                        ? "Adding..."
                                        : "Confirm Add to Cart"}
                                </button>

                                <button
                                    className="btn btn-outline-secondary ms-2"
                                    onClick={() => setPendingActions([])}
                                    disabled={confirming}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AIShopping;

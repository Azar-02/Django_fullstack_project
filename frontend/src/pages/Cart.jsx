
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";
import "./Cart.css";

function Cart() {
    const navigate = useNavigate();

    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [placingOrder, setPlacingOrder] = useState(false);

    useEffect(() => {
        fetchCart();
    }, []);

    const handleUnauthorized = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

        alert("Your session has expired. Please login again.");
        navigate("/login");
    };

    const handleError = (error) => {
        if (
            error.response?.status === 401 ||
            error.response?.status === 403
        ) {
            handleUnauthorized();
            return true;
        }

        console.error(error);
        return false;
    };

    const fetchCart = async () => {
        try {
            const response = await api.get("cart/");
            setCart(response.data);
        } catch (error) {
            handleError(error);
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (itemId, quantity) => {
        if (quantity < 1) return;

        try {
            await api.patch(`cart/items/${itemId}/`, {
                quantity,
            });

            await fetchCart();
        } catch (error) {
            handleError(error);
        }
    };

    const removeItem = async (itemId) => {
        try {
            await api.delete(`cart/items/${itemId}/delete/`);
            await fetchCart();
        } catch (error) {
            handleError(error);
        }
    };

    const placeOrder = async () => {
        try {
            setPlacingOrder(true);

            await api.post("orders/place/");

            alert("Order placed successfully!");
            navigate("/orders");
        } catch (error) {
            if (!handleError(error)) {
                alert(
                    error.response?.data?.detail ||
                    "Unable to place order. Please try again."
                );
            }
        } finally {
            setPlacingOrder(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <div
                    className="spinner-border text-success"
                    role="status"
                />
                <p className="mt-3">Loading your cart...</p>
            </div>
        );
    }

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div className="cart-page">

                <h2 className="cart-heading">
                    🛒 Your Cart
                </h2>

                <div className="cart-empty">

                    <div className="cart-empty-icon">
                        🛍️
                    </div>

                    <h3>Your cart is empty</h3>

                    <p className="text-muted mt-2">
                        Looks like you haven't added anything yet.
                        Explore our menu and find your favourites!
                    </p>

                    <button
                        className="btn btn-success mt-3 px-4 py-2"
                        onClick={() => navigate("/products")}
                    >
                        Explore Menu →
                    </button>

                </div>

            </div>
        );
    }

    return (
        <div className="cart-page">

            <h2 className="cart-heading">
                🛒 Your Cart
            </h2>

            <p className="text-muted mb-4">
                Review your items before placing your order.
            </p>

            {/* CART ITEMS */}

            {cart.items.map((item) => (
                <div
                    key={item.id}
                    className="cart-item-card"
                >

                    <div>

                        <h5 className="cart-item-name">
                            {item.product_name}
                        </h5>

                        <p className="cart-item-price">
                            Unit Price: ₹{item.price}
                        </p>

                        <div className="cart-item-subtotal">
                            Subtotal: ₹{item.subtotal}
                        </div>

                    </div>

                    <div className="cart-item-actions">

                        <button
                            className="cart-quantity-button"
                            onClick={() =>
                                updateQuantity(
                                    item.id,
                                    item.quantity - 1
                                )
                            }
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                        >
                            −
                        </button>

                        <span className="cart-quantity-value">
                            {item.quantity}
                        </span>

                        <button
                            className="cart-quantity-button"
                            onClick={() =>
                                updateQuantity(
                                    item.id,
                                    item.quantity + 1
                                )
                            }
                            aria-label="Increase quantity"
                        >
                            +
                        </button>

                        <button
                            className="cart-remove-button"
                            onClick={() => removeItem(item.id)}
                        >
                            Remove
                        </button>

                    </div>

                </div>
            ))}

            {/* ORDER SUMMARY */}

            <div className="cart-summary">

                <h4 className="fw-bold mb-4">
                    Order Summary
                </h4>

                <div className="cart-summary-row">
                    <span>Total Items</span>
                    <strong>
                        {cart.items.reduce(
                            (total, item) => total + item.quantity,
                            0
                        )}
                    </strong>
                </div>

                <hr />

                <div className="cart-summary-row mb-4">
                    <strong>Total Amount</strong>

                    <span className="cart-total">
                        ₹{cart.total}
                    </span>
                </div>

                <button
                    className="cart-place-order"
                    onClick={placeOrder}
                    disabled={placingOrder}
                >
                    {placingOrder
                        ? "Placing Order..."
                        : "Place Order →"}
                </button>

                <button
                    className="btn btn-outline-secondary w-100 mt-2"
                    onClick={() => navigate("/products")}
                >
                    Continue Shopping
                </button>

            </div>

        </div>
    );
}

export default Cart;

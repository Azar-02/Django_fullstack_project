import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";

function Cart() {

    const navigate = useNavigate();

    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetchCart();

    }, []);

    const handleUnauthorized = () => {

        localStorage.clear();

        alert("Your session has expired. Please login again.");

        navigate("/login");

    };

    const fetchCart = async () => {

        try {

            const response = await api.get("cart/");

            setCart(response.data);

        }

        catch (error) {

            if (
                error.response?.status === 401 ||
                error.response?.status === 403
            ) {

                handleUnauthorized();

                return;

            }

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    };

    const updateQuantity = async (itemId, quantity) => {

        if (quantity < 1) return;

        try {

            await api.patch(

                `cart/items/${itemId}/`,

                {
                    quantity,
                }

            );

            fetchCart();

        }

        catch (error) {

            if (
                error.response?.status === 401 ||
                error.response?.status === 403
            ) {

                handleUnauthorized();

                return;

            }

            console.log(error);

        }

    };

    const removeItem = async (itemId) => {

        try {

            await api.delete(

                `cart/items/${itemId}/delete/`

            );

            fetchCart();

        }

        catch (error) {

            if (
                error.response?.status === 401 ||
                error.response?.status === 403
            ) {

                handleUnauthorized();

                return;

            }

            console.log(error);

        }

    };

    const placeOrder = async () => {

        try {

            await api.post("orders/place/");

            alert("Order placed successfully!");

            navigate("/orders");

        }

        catch (error) {

            if (
                error.response?.status === 401 ||
                error.response?.status === 403
            ) {

                handleUnauthorized();

                return;

            }

            alert("Unable to place order.");

            console.log(error);

        }

    };

    if (loading) {

        return (

            <div className="text-center py-5">

                <div
                    className="spinner-border text-success"
                    role="status"
                >
                </div>

                <p className="mt-3">

                    Loading Cart...

                </p>

            </div>

        );

    }

    if (!cart || cart.items.length === 0) {

        return (

            <div className="text-center py-5">

                <h2 className="mb-4">

                    🛒 Your Cart

                </h2>

                <div className="alert alert-info">

                    Your cart is empty.

                </div>

                <button
                    className="btn btn-success mt-3"
                    onClick={() => navigate("/products")}
                >

                    Continue Shopping

                </button>

            </div>

        );

    }

    return (

        <div>

            <h2 className="mb-4">

                🛒 Your Cart

            </h2>

            {

                cart.items.map((item) => (

                    <div
                        key={item.id}
                        className="card shadow-sm mb-3"
                    >

                        <div className="card-body">

                            <h5>

                                {item.product_name}

                            </h5>

                            <p className="mb-2">

                                Price : ₹{item.price}

                            </p>

                            <p className="mb-2">

                                Quantity : {item.quantity}

                            </p>

                            <p>

                                <strong>

                                    Subtotal : ₹{item.subtotal}

                                </strong>

                            </p>

                            <button
                                className="btn btn-secondary me-2"
                                onClick={() =>
                                    updateQuantity(
                                        item.id,
                                        item.quantity - 1
                                    )
                                }
                            >

                                -

                            </button>

                            <button
                                className="btn btn-secondary me-3"
                                onClick={() =>
                                    updateQuantity(
                                        item.id,
                                        item.quantity + 1
                                    )
                                }
                            >

                                +

                            </button>

                            <button
                                className="btn btn-danger"
                                onClick={() =>
                                    removeItem(item.id)
                                }
                            >

                                Remove

                            </button>

                        </div>

                    </div>

                ))

            }

            <div className="mt-4">

                <h3>

                    Total : ₹{cart.total}

                </h3>

                <button
                    className="btn btn-success mt-3"
                    onClick={placeOrder}
                >

                    Place Order

                </button>

            </div>

        </div>

    );

}

export default Cart;
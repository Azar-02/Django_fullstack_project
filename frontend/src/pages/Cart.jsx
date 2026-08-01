import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Cart() {

    const [cart, setCart] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {

        try {

            const response = await api.get("cart/");

            setCart(response.data);

        } catch (error) {

            console.log(error);

        }

    };

    const updateQuantity = async (itemId, quantity) => {

        if (quantity < 1) return;

        try {

            await api.patch(`cart/items/${itemId}/`, {
                quantity,
            });

            fetchCart();

        } catch (error) {

            console.log(error);

        }

    };

    const removeItem = async (itemId) => {

        try {

            await api.delete(`cart/items/${itemId}/delete/`);

            fetchCart();

        } catch (error) {

            console.log(error);

        }

    };

    const placeOrder = async () => {

        try {

            await api.post("orders/place/");

            alert("Order placed successfully!");

            navigate("/orders");

        } catch {

            alert("Unable to place order.");

        }

    };

    if (!cart) {

        return (

            <div className="text-center mt-5">

                <div
                    className="spinner-border text-success"
                    role="status"
                />

                <p className="mt-3">

                    Loading Cart...

                </p>

            </div>

        );

    }

    return (

        <div>

            <h2 className="mb-4">

                🛒 Your Cart

            </h2>

            {cart.items.length === 0 ? (

                <div className="text-center mt-5">

                    <h3>

                        Your Cart is Empty

                    </h3>

                    <p className="text-muted">

                        Add some delicious tea and snacks.

                    </p>

                    <button
                        className="btn btn-success"
                        onClick={() => navigate("/products")}
                    >

                        Browse Menu

                    </button>

                </div>

            ) : (

                <>

                    {cart.items.map((item) => (

                        <div
                            key={item.id}
                            className="card shadow-sm mb-3"
                        >

                            <div className="card-body">

                                <div className="d-flex justify-content-between align-items-center">

                                    <div>

                                        <h5>

                                            {item.product_name}

                                        </h5>

                                        <p className="text-muted mb-1">

                                            Price : ₹{item.price}

                                        </p>

                                        <p>

                                            Subtotal : ₹{item.subtotal}

                                        </p>

                                    </div>

                                    <div>

                                        <p>

                                            Quantity : {item.quantity}

                                        </p>

                                    </div>

                                </div>

                                <div className="mt-3">

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

                        </div>

                    ))}

                    <div className="text-end mt-4">

                        <h3>

                            Total : ₹{cart.total}

                        </h3>

                        <button
                            className="btn btn-success btn-lg mt-2"
                            onClick={placeOrder}
                        >

                            Place Order

                        </button>

                    </div>

                </>

            )}

        </div>

    );

}

export default Cart;
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

        }

        catch (error) {

            console.log(error);

        }

    };

    const updateQuantity = async (itemId, quantity) => {

        if (quantity < 1) return;

        await api.patch(

            `cart/items/${itemId}/`,

            {

                quantity,

            }

        );

        fetchCart();

    };

    const removeItem = async (itemId) => {

        await api.delete(

            `cart/items/${itemId}/delete/`

        );

        fetchCart();

    };

    const placeOrder = async () => {

        try {

            await api.post("orders/place/");

            alert("Order Placed Successfully!");

            navigate("/orders");

        }

        catch {

            alert("Unable to place order.");

        }

    };

    if (!cart) {

        return <h3>Loading...</h3>;

    }

    return (

        <div>

            <h2 className="mb-4">

                Your Cart

            </h2>

            {cart.items.length === 0 ? (

                <div className="alert alert-info">

                    Your cart is empty.

                </div>

            ) : (

                <>

                    {cart.items.map((item) => (

                        <div
                            key={item.id}
                            className="card mb-3"
                        >

                            <div className="card-body">

                                <h5>

                                    {item.product_name}

                                </h5>

                                <p>

                                    ₹{item.price}

                                </p>

                                <p>

                                    Quantity : {item.quantity}

                                </p>

                                <p>

                                    Subtotal : ₹{item.subtotal}

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

                    ))}

                    <h4>

                        Total : ₹{cart.total}

                    </h4>

                    <button
                        className="btn btn-success mt-3"
                        onClick={placeOrder}
                    >

                        Place Order

                    </button>

                </>

            )}

        </div>

    );

}

export default Cart;
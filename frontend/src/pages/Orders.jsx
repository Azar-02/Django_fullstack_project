import { useEffect, useState } from "react";
import api from "../api/axios";

function Orders() {

    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetchOrders();

    }, []);

    const fetchOrders = async () => {

        try {

            const response = await api.get("orders/");

            setOrders(response.data);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    if (loading) {

        return (

            <div className="text-center mt-5">

                <div
                    className="spinner-border text-success"
                    role="status"
                />

                <p className="mt-3">

                    Loading Orders...

                </p>

            </div>

        );

    }

    if (orders.length === 0) {

        return (

            <div className="text-center mt-5">

                <h2>

                    📦 No Orders Yet

                </h2>

                <p className="text-muted">

                    Place your first order today.

                </p>

            </div>

        );

    }

    return (

        <div>

            <h2 className="mb-4">

                📦 My Orders

            </h2>

            {orders.map((order) => (

                <div
                    key={order.id}
                    className="card shadow-sm mb-4"
                >

                    <div className="card-header">

                        <strong>

                            Order #{order.id}

                        </strong>

                    </div>

                    <div className="card-body">

                        <p>

                            <strong>Date :</strong>{" "}

                            {new Date(
                                order.created_at
                            ).toLocaleString()}

                        </p>

                        <ul className="list-group mb-3">

                            {order.items.map((item) => (

                                <li
                                    key={`${order.id}-${item.product_name}`}
                                    className="list-group-item d-flex justify-content-between"
                                >

                                    <span>

                                        {item.product_name} × {item.quantity}

                                    </span>

                                    <strong>

                                        ₹{item.price}

                                    </strong>

                                </li>

                            ))}

                        </ul>

                        <h4 className="text-success">

                            Total : ₹{order.total}

                        </h4>

                    </div>

                </div>

            ))}

        </div>

    );

}

export default Orders;
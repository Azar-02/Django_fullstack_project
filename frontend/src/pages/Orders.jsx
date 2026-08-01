import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";

function Orders() {

    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetchOrders();

    }, []);

    const handleUnauthorized = () => {

        localStorage.clear();

        alert("Your session has expired. Please login again.");

        navigate("/login");

    };

    const fetchOrders = async () => {

        try {

            const response = await api.get("orders/");

            setOrders(response.data);

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

    if (loading) {

        return (

            <div className="text-center py-5">

                <div
                    className="spinner-border text-success"
                    role="status"
                >
                </div>

                <p className="mt-3">

                    Loading Orders...

                </p>

            </div>

        );

    }

    if (orders.length === 0) {

        return (

            <div className="text-center py-5">

                <h2>

                    📦 No Orders Yet

                </h2>

                <p className="text-muted">

                    You haven't placed any orders yet.

                </p>

                <button
                    className="btn btn-success mt-3"
                    onClick={() => navigate("/products")}
                >

                    Browse Menu

                </button>

            </div>

        );

    }

    return (

        <div>

            <h2 className="mb-4">

                📦 My Orders

            </h2>

            {

                orders.map((order) => (

                    <div
                        key={order.id}
                        className="card shadow-sm border-0 mb-4"
                    >

                        <div className="card-header d-flex justify-content-between align-items-center">

                            <span className="fw-bold">

                                Order #{order.id}

                            </span>

                            <span className="badge bg-success">

                                Completed

                            </span>

                        </div>

                        <div className="card-body">

                            <p className="text-muted">

                                <strong>Date :</strong>{" "}

                                {new Date(
                                    order.created_at
                                ).toLocaleString()}

                            </p>

                            <ul className="list-group mb-3">

                                {

                                    order.items.map((item) => (

                                        <li
                                            key={`${order.id}-${item.product_name}`}
                                            className="list-group-item d-flex justify-content-between align-items-center"
                                        >

                                            <div>

                                                <strong>

                                                    {item.product_name}

                                                </strong>

                                                <br />

                                                <small className="text-muted">

                                                    Quantity : {item.quantity}

                                                </small>

                                            </div>

                                            <strong>

                                                ₹{item.price}

                                            </strong>

                                        </li>

                                    ))

                                }

                            </ul>

                            <div className="d-flex justify-content-between align-items-center">

                                <h5 className="mb-0">

                                    Total Amount

                                </h5>

                                <h4 className="text-success mb-0">

                                    ₹{order.total}

                                </h4>

                            </div>

                        </div>

                    </div>

                ))

            }

        </div>

    );

}

export default Orders;
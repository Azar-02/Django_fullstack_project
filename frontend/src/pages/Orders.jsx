import { useEffect, useState } from "react";
import api from "../api/axios";

function Orders() {

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.get("orders/");
            setOrders(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    if (orders.length === 0) {
        return (
            <div className="alert alert-info">
                No orders found.
            </div>
        );
    }

    return (
        <div>

            <h2 className="mb-4">
                My Orders
            </h2>

            {orders.map((order) => (

                <div
                    key={order.id}
                    className="card mb-4"
                >

                    <div className="card-header">

                        <strong>
                            Order #{order.id}
                        </strong>

                    </div>

                    <div className="card-body">

                        <p>

                            <strong>Date:</strong>{" "}

                            {new Date(
                                order.created_at
                            ).toLocaleString()}

                        </p>

                        <ul className="list-group mb-3">

                            {order.items.map((item) => (

                                <li
                                    key={item.product_name}
                                    className="list-group-item d-flex justify-content-between"
                                >

                                    <span>

                                        {item.product_name}

                                        ×

                                        {item.quantity}

                                    </span>

                                    <span>

                                        ₹{item.price}

                                    </span>

                                </li>

                            ))}

                        </ul>

                        <h5>

                            Total : ₹{order.total}

                        </h5>

                    </div>

                </div>

            ))}

        </div>
    );

}

export default Orders;
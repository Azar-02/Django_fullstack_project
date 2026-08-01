import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";
import ProductCard from "../components/ProductCard";

function Products() {

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetchProducts();

    }, []);

    const handleUnauthorized = () => {

        localStorage.clear();

        alert("Your session has expired. Please login again.");

        navigate("/login");

    };

    const fetchProducts = async () => {

        try {

            const response = await api.get("products/");

            setProducts(response.data);

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

    const addToCart = async (productId) => {

        try {

            await api.post(
                "cart/add/",
                {
                    product_id: productId,
                    quantity: 1,
                }
            );

            alert("Item added to cart successfully!");

        }

        catch (error) {

            if (
                error.response?.status === 401 ||
                error.response?.status === 403
            ) {

                handleUnauthorized();

                return;

            }

            alert("Unable to add item to cart.");

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

                    Loading Menu...

                </p>

            </div>

        );

    }

    if (products.length === 0) {

        return (

            <div className="text-center py-5">

                <h2>

                    🍵 Tea Palace Menu

                </h2>

                <p className="text-muted">

                    No products available at the moment.

                </p>

            </div>

        );

    }

    return (

        <div>

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 className="mb-1">

                        🍵 Tea Palace Menu

                    </h2>

                    <p className="text-muted mb-0">

                        Explore our freshly prepared tea, coffee and snacks.

                    </p>

                </div>

                <span className="badge bg-success fs-6">

                    {products.length} Items

                </span>

            </div>

            <div className="row">

                {

                    products.map((product) => (

                        <ProductCard
                            key={product.id}
                            product={product}
                            onAddToCart={addToCart}
                        />

                    ))

                }

            </div>

        </div>

    );

}

export default Products;
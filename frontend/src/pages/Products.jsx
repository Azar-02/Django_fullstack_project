
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import "./Products.css";

function Products() {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

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
        } catch (error) {
            if (
                error.response?.status === 401 ||
                error.response?.status === 403
            ) {
                handleUnauthorized();
                return;
            }

            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (productId) => {
        try {
            await api.post("cart/add/", {
                product_id: productId,
                quantity: 1,
            });

            alert("Item added to cart successfully!");
        } catch (error) {
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

    const categories = [
        "All",
        ...new Set(
            products
                .map((product) => product.category_name)
                .filter(Boolean)
        ),
    ];

    const filteredProducts = products.filter((product) => {
        const matchesSearch =
            product.name.toLowerCase().includes(search.toLowerCase()) ||
            (product.description || "")
                .toLowerCase()
                .includes(search.toLowerCase());

        const matchesCategory =
            selectedCategory === "All" ||
            product.category_name === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    if (loading) {
        return (
            <div className="text-center py-5">
                <div
                    className="spinner-border text-success"
                    role="status"
                />
                <p className="mt-3">Loading our menu...</p>
            </div>
        );
    }

    return (
        <div className="menu-page">

            {/* MENU HEADER */}

            <section className="menu-hero">
                <h1>Discover Our Menu</h1>

                <p>
                    Explore delicious snacks, refreshing beverages,
                    tea and coffee made for every craving.
                </p>
            </section>

            {/* SEARCH AND CATEGORY FILTER */}

            <div className="menu-toolbar">

                <input
                    type="text"
                    className="menu-search"
                    placeholder="Search for your favourite food or drink..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                />

                <select
                    className="menu-filter"
                    value={selectedCategory}
                    onChange={(event) =>
                        setSelectedCategory(event.target.value)
                    }
                >
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category === "All"
                                ? "All Categories"
                                : category}
                        </option>
                    ))}
                </select>

            </div>

            {/* PRODUCT COUNT */}

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold mb-0">
                    {selectedCategory === "All"
                        ? "Our Favourites"
                        : selectedCategory}
                </h4>

                <span className="badge bg-success fs-6">
                    {filteredProducts.length} Items
                </span>
            </div>

            {/* PRODUCT GRID */}

            {filteredProducts.length > 0 ? (
                <div className="row g-4">

                    {filteredProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onAddToCart={addToCart}
                        />
                    ))}

                </div>
            ) : (
                <div className="menu-empty">
                    <div className="display-4 mb-3">🔍</div>

                    <h4>No products found</h4>

                    <p>
                        Try another search or select a different category.
                    </p>

                    <button
                        className="btn btn-success"
                        onClick={() => {
                            setSearch("");
                            setSelectedCategory("All");
                        }}
                    >
                        Clear Filters
                    </button>
                </div>
            )}

        </div>
    );
}

export default Products;

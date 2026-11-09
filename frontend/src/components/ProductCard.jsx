
function ProductCard({ product, onAddToCart }) {
    return (
        <div className="col-lg-4 col-md-6">

            <div className="menu-product-card">

                {product.image && (
                    <img
                        src={product.image}
                        className="menu-product-image"
                        alt={product.name}
                    />
                )}

                <div className="menu-product-content">

                    <span className="menu-product-category">
                        {product.category_name || "Menu"}
                    </span>

                    <h5 className="menu-product-name">
                        {product.name}
                    </h5>

                    <p className="menu-product-description">
                        {product.description ||
                            "A delicious Tea Palace favourite."}
                    </p>

                    <div className="d-flex justify-content-between align-items-center">

                        <span
                            className={`badge ${
                                product.available
                                    ? "bg-success"
                                    : "bg-secondary"
                            }`}
                        >
                            {product.available
                                ? "Available"
                                : "Currently Unavailable"}
                        </span>

                    </div>

                    <div className="menu-product-price">
                        ₹{product.price}
                    </div>

                    <button
                        className="menu-add-button"
                        onClick={() => onAddToCart(product.id)}
                        disabled={!product.available}
                    >
                        🛒 Add to Cart
                    </button>

                </div>

            </div>

        </div>
    );
}

export default ProductCard;

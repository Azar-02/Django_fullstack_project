function ProductCard({ product, onAddToCart }) {
    return (
        <div className="col-md-4 mb-4">
            <div className="card h-100">

                {product.image && (
                    <img
                        src={product.image}
                        className="card-img-top"
                        alt={product.name}
                        style={{ height: "220px", objectFit: "cover" }}
                    />
                )}

                <div className="card-body d-flex flex-column">

                    <h5>{product.name}</h5>

                    <p className="text-muted">
                        {product.category_name}
                    </p>

                    <p>{product.price}</p>

                    <button
                        className="btn btn-success mt-auto"
                        onClick={() => onAddToCart(product.id)}
                    >
                        Add To Cart
                    </button>

                </div>

            </div>
        </div>
    );
}

export default ProductCard;
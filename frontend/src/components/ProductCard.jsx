function ProductCard({ product, onAddToCart }) {

    return (

        <div className="col-md-4 mb-4">

            <div className="card h-100 shadow-sm">

                <img
                    src={product.image}
                    className="card-img-top"
                    alt={product.name}
                    style={{
                        height: "250px",
                        objectFit: "cover",
                    }}
                />

                <div className="card-body d-flex flex-column">

                    <span className="badge bg-success mb-2">
                        {product.category_name}
                    </span>

                    <h4>{product.name}</h4>

                    <p className="text-muted">

                        Freshly prepared and served with love.

                    </p>

                    <h5 className="text-success">

                        ₹{product.price}

                    </h5>

                    <p>

                        ⭐⭐⭐⭐⭐

                    </p>

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
function ProductCard({ product, onAddToCart }) {

    return (

        <div className="col-lg-4 col-md-6 mb-4">

            <div className="card h-100 shadow-sm border-0">

                <img
                    src={product.image}
                    className="card-img-top"
                    alt={product.name}
                    style={{
                        height: "230px",
                        objectFit: "cover",
                    }}
                />

                <div className="card-body d-flex flex-column">

                    <span className="badge bg-success align-self-start mb-2">

                        {product.category_name}

                    </span>

                    <h5 className="fw-bold">

                        {product.name}

                    </h5>

                    <p className="text-muted small mb-3">

                        Freshly prepared using quality ingredients.
                        Perfect with a hot cup of tea.

                    </p>

                    <div className="mb-3">

                        <span className="text-warning fs-5">

                            ★★★★★

                        </span>

                    </div>

                    <h4 className="text-success fw-bold mb-3">

                        ₹{product.price}

                    </h4>

                    <button
                        className="btn btn-success mt-auto w-100"
                        onClick={() => onAddToCart(product.id)}
                    >

                        🛒 Add To Cart

                    </button>

                </div>

            </div>

        </div>

    );

}

export default ProductCard;
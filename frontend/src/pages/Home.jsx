import { Link } from "react-router-dom";

function Home() {

    return (

        <>

            <div
                className="text-center text-white rounded shadow p-5"
                style={{
                    background:
                        "linear-gradient(rgba(0,0,0,.55), rgba(0,0,0,.55)), url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1600')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    minHeight: "420px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                }}
            >

                <h1 className="display-3 fw-bold">

                    🍵 Tea Palace

                </h1>

                <p className="lead my-4">

                    Fresh Tea • Delicious Snacks • Refreshing Drinks

                </p>

                <p className="mb-4">

                    Experience freshly brewed tea, crispy snacks and refreshing
                    beverages served with quality and care.

                </p>

                <div>

                    <Link
                        to="/products"
                        className="btn btn-success btn-lg me-3"
                    >

                        Explore Menu

                    </Link>

                    <Link
                        to="/register"
                        className="btn btn-outline-light btn-lg"
                    >

                        Get Started

                    </Link>

                </div>

            </div>

            <div className="row text-center mt-5">

                <div className="col-md-4 mb-4">

                    <div className="card shadow-sm border-0 h-100">

                        <div className="card-body">

                            <div className="display-5 mb-3">

                                ☕

                            </div>

                            <h4>

                                Premium Tea

                            </h4>

                            <p className="text-muted">

                                Discover classic Indian tea, green tea,
                                lemon tea and refreshing iced tea.

                            </p>

                        </div>

                    </div>

                </div>

                <div className="col-md-4 mb-4">

                    <div className="card shadow-sm border-0 h-100">

                        <div className="card-body">

                            <div className="display-5 mb-3">

                                🥪

                            </div>

                            <h4>

                                Fresh Snacks

                            </h4>

                            <p className="text-muted">

                                Enjoy freshly prepared sandwiches,
                                fries and delicious bakery snacks.

                            </p>

                        </div>

                    </div>

                </div>

                <div className="col-md-4 mb-4">

                    <div className="card shadow-sm border-0 h-100">

                        <div className="card-body">

                            <div className="display-5 mb-3">

                                🥤

                            </div>

                            <h4>

                                Refreshing Drinks

                            </h4>

                            <p className="text-muted">

                                Coolers, coffee and beverages
                                to perfectly complement your meal.

                            </p>

                        </div>

                    </div>

                </div>

            </div>

            <div className="mt-5">

                <div className="card bg-light border-0 shadow-sm">

                    <div className="card-body text-center py-5">

                        <h2>

                            Why Choose Tea Palace?

                        </h2>

                        <p className="text-muted mt-3">

                            We serve freshly brewed tea, delicious snacks,
                            and refreshing beverages made with quality ingredients.
                            Whether you're looking for a quick break or a relaxing cup
                            of tea, Tea Palace has something for everyone.

                        </p>

                    </div>

                </div>

            </div>

        </>

    );

}

export default Home;
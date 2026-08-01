import { Link } from "react-router-dom";

function Home() {
    return (
        <>
            <div className="bg-light rounded p-5 text-center">

                <h1 className="display-4">
                    🍵 Welcome to Tea Palace
                </h1>

                <p className="lead mt-3">
                    Fresh Tea • Delicious Snacks • Refreshing Beverages
                </p>

                <p>
                    Order your favorite tea and snacks in just a few clicks.
                </p>

                <Link
                    to="/products"
                    className="btn btn-success btn-lg mt-3"
                >
                    Explore Menu
                </Link>

            </div>

            <div className="row mt-5">

                <div className="col-md-4 text-center">
                    <h3>☕ Premium Tea</h3>
                    <p>Freshly brewed traditional Indian tea.</p>
                </div>

                <div className="col-md-4 text-center">
                    <h3>🥪 Tasty Snacks</h3>
                    <p>Samosa, Sandwiches, Fries and more.</p>
                </div>

                <div className="col-md-4 text-center">
                    <h3>🥤 Cold Drinks</h3>
                    <p>Cold Coffee, Iced Tea and Lemon Soda.</p>
                </div>

            </div>
        </>
    );
}

export default Home;
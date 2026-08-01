import { Link } from "react-router-dom";

function Home() {

    return (

        <>

            <div
                className="text-center text-white rounded p-5"
                style={{

                    background:
                        "linear-gradient(rgba(0,0,0,.5),rgba(0,0,0,.5)), url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200')",

                    backgroundSize: "cover",

                    backgroundPosition: "center",

                }}
            >

                <h1 className="display-3">

                    🍵 Tea Palace

                </h1>

                <p className="lead">

                    Fresh Tea • Delicious Snacks • Refreshing Drinks

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

                    <h3>☕ Tea</h3>

                    <p>

                        Traditional Indian Tea varieties.

                    </p>

                </div>

                <div className="col-md-4 text-center">

                    <h3>🥪 Snacks</h3>

                    <p>

                        Crispy snacks served fresh.

                    </p>

                </div>

                <div className="col-md-4 text-center">

                    <h3>🥤 Drinks</h3>

                    <p>

                        Coffee, Juices and Coolers.

                    </p>

                </div>

            </div>

        </>

    );

}

export default Home;
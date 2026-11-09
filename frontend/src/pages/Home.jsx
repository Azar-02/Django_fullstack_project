
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
    return (
        <div className="home-page">

            {/* HERO SECTION */}

            <section className="home-hero">
                <div className="home-hero-content">

                    <span className="home-eyebrow">
                        Welcome to Tea Palace
                    </span>

                    <h1>
                        Good Food.
                        <br />
                        Great Moments.
                    </h1>

                    <p>
                        From refreshing tea and coffee to delicious snacks
                        and cool beverages, discover something special
                        for every moment.
                    </p>

                    <div className="d-flex flex-wrap gap-3 mt-4">

                        <Link
                            to="/products"
                            className="btn home-btn-primary"
                        >
                            Explore Our Menu →
                        </Link>

                        <Link
                            to="/ai-shopping"
                            className="btn home-btn-outline"
                        >
                            🤖 Ask Our AI
                        </Link>

                    </div>
                </div>
            </section>

            {/* CATEGORY SECTION */}

            <section className="home-section">

                <div className="home-section-heading">
                    <span>Explore Our Menu</span>

                    <h2>Something for Every Craving</h2>

                    <p>
                        Freshly prepared favourites to make your day better.
                    </p>
                </div>

                <div className="row g-4">

                    <div className="col-md-4">
                        <div className="home-category-card">

                            <div className="home-category-icon">
                                ☕
                            </div>

                            <h4>Tea & Coffee</h4>

                            <p>
                                Enjoy comforting tea, refreshing iced tea
                                and delicious coffee.
                            </p>

                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="home-category-card">

                            <div className="home-category-icon">
                                🥐
                            </div>

                            <h4>Delicious Snacks</h4>

                            <p>
                                Enjoy crispy puffs, fries, sandwiches
                                and tasty bites.
                            </p>

                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="home-category-card">

                            <div className="home-category-icon">
                                🥤
                            </div>

                            <h4>Cool Beverages</h4>

                            <p>
                                Refresh yourself with juices, milkshakes,
                                mojitos and coolers.
                            </p>

                        </div>
                    </div>

                </div>

            </section>

            {/* AI SHOPPING FEATURE */}

            <section className="home-ai-section">

                <div className="row align-items-center">

                    <div className="col-md-8">

                        <div className="home-ai-icon">
                            🤖
                        </div>

                        <h2>Meet Your AI Shopping Assistant</h2>

                        <p>
                            Not sure what to order? Tell our AI your cravings
                            or budget. It can explore our menu, recommend
                            products and help you build your cart.
                        </p>

                    </div>

                    <div className="col-md-4 text-md-end">

                        <Link
                            to="/ai-shopping"
                            className="btn home-btn-primary"
                        >
                            Try AI Shopping →
                        </Link>

                    </div>

                </div>

            </section>

            {/* WHY CHOOSE US */}

            <section className="home-benefits">

                <div className="home-section-heading">

                    <span>The Tea Palace Experience</span>

                    <h2>Why Choose Us?</h2>

                    <p>
                        Good food, refreshing drinks and a better shopping experience.
                    </p>

                </div>

                <div className="row g-4">

                    <div className="col-md-4">
                        <div className="home-benefit">

                            <div className="home-benefit-icon">
                                🌿
                            </div>

                            <h5>Quality & Freshness</h5>

                            <p>
                                Discover delicious menu options prepared
                                with care.
                            </p>

                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="home-benefit">

                            <div className="home-benefit-icon">
                                ❤️
                            </div>

                            <h5>Something for Everyone</h5>

                            <p>
                                From a quick snack to a refreshing drink,
                                find your favourite.
                            </p>

                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="home-benefit">

                            <div className="home-benefit-icon">
                                ✨
                            </div>

                            <h5>Smart AI Experience</h5>

                            <p>
                                Get product recommendations and budget-friendly
                                shopping assistance.
                            </p>

                        </div>
                    </div>

                </div>

            </section>

            {/* FINAL CTA */}

            <section className="text-center py-5 mt-5">

                <h2 className="fw-bold">
                    Ready to Find Your Favourite?
                </h2>

                <p className="text-muted mt-3">
                    Explore the Tea Palace menu and discover something delicious.
                </p>

                <Link
                    to="/products"
                    className="btn home-btn-primary mt-2"
                >
                    Browse Menu →
                </Link>

            </section>

        </div>
    );
}

export default Home;

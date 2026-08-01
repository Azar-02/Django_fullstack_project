import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();

    const token = localStorage.getItem("access");

    const logout = () => {

        const confirmLogout = window.confirm(
            "Are you sure you want to logout?"
        );

        if (!confirmLogout) return;

        localStorage.clear();

        navigate("/login");

    };

    const navClass = ({ isActive }) =>
        isActive
            ? "nav-link fw-semibold text-warning"
            : "nav-link text-white";

    return (

        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">

            <div className="container">

                <NavLink
                    to="/"
                    className="navbar-brand fw-bold fs-4"
                >
                    🍵 Tea Palace
                </NavLink>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div
                    className="collapse navbar-collapse"
                    id="navbarNav"
                >

                    <ul className="navbar-nav ms-auto align-items-lg-center">

                        <li className="nav-item">

                            <NavLink
                                to="/"
                                className={navClass}
                            >
                                Home
                            </NavLink>

                        </li>

                        <li className="nav-item">

                            <NavLink
                                to="/products"
                                className={navClass}
                            >
                                🍵 Menu
                            </NavLink>

                        </li>

                        {token ? (

                            <>

                                <li className="nav-item">

                                    <NavLink
                                        to="/cart"
                                        className={navClass}
                                    >
                                        🛒 Cart
                                    </NavLink>

                                </li>

                                <li className="nav-item">

                                    <NavLink
                                        to="/orders"
                                        className={navClass}
                                    >
                                        📦 Orders
                                    </NavLink>

                                </li>

                                <li className="nav-item ms-lg-3 mt-2 mt-lg-0">

                                    <button
                                        className="btn btn-outline-warning btn-sm px-3"
                                        onClick={logout}
                                    >
                                        Logout
                                    </button>

                                </li>

                            </>

                        ) : (

                            <>

                                <li className="nav-item">

                                    <NavLink
                                        to="/login"
                                        className={navClass}
                                    >
                                        Login
                                    </NavLink>

                                </li>

                                <li className="nav-item">

                                    <NavLink
                                        to="/register"
                                        className={navClass}
                                    >
                                        Register
                                    </NavLink>

                                </li>

                            </>

                        )}

                    </ul>

                </div>

            </div>

        </nav>

    );

}

export default Navbar;

import { Link, useNavigate } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();

    const token = localStorage.getItem("access");

    const logout = () => {

        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

        navigate("/login");

    };

    return (

        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">

            <div className="container">

                <Link className="navbar-brand" to="/">
                    🍵 Tea Palace
                </Link>

                <div className="navbar-nav ms-auto">

                    <Link className="nav-link" to="/">
                        Home
                    </Link>

                    <Link className="nav-link" to="/products">
                        Products
                    </Link>

                    {token ? (
                        <>

                            <Link
                                className="nav-link"
                                to="/cart"
                            >
                                Cart
                            </Link>

                            <Link
                                className="nav-link"
                                to="/orders"
                            >
                                Orders
                            </Link>

                            <button
                                className="btn btn-link nav-link"
                                onClick={logout}
                            >
                                Logout
                            </button>

                        </>
                    ) : (
                        <>
                            <Link
                                className="nav-link"
                                to="/login"
                            >
                                Login
                            </Link>

                            <Link
                                className="nav-link"
                                to="/register"
                            >
                                Register
                            </Link>
                        </>
                    )}

                </div>

            </div>

        </nav>

    );

}

export default Navbar;
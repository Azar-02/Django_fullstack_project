import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import api from "../api/axios";

function Login() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const handleChange = (e) => {

        setForm({

            ...form,

            [e.target.name]: e.target.value,

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            const response = await api.post(
                "auth/login/",
                form
            );

            localStorage.setItem(
                "access",
                response.data.access
            );

            localStorage.setItem(
                "refresh",
                response.data.refresh
            );

            alert("Login Successful!");

            navigate("/products");

        }

        catch (error) {

            if (error.response?.data?.detail) {

                alert(error.response.data.detail);

            } else {

                alert("Invalid Username or Password.");

            }

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="row justify-content-center">

            <div className="col-md-6 col-lg-5">

                <div className="card shadow border-0">

                    <div className="card-body p-4">

                        <h2 className="text-center mb-4">

                            Welcome Back

                        </h2>

                        <form onSubmit={handleSubmit}>

                            <div className="mb-3">

                                <label className="form-label">

                                    Username

                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="username"
                                    value={form.username}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <div className="mb-4">

                                <label className="form-label">

                                    Password

                                </label>

                                <input
                                    type="password"
                                    className="form-control"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <button
                                className="btn btn-success w-100"
                                disabled={loading}
                            >

                                {loading
                                    ? "Signing In..."
                                    : "Login"}

                            </button>

                        </form>

                        <hr />

                        <p className="text-center mb-0">

                            Don't have an account?{" "}

                            <Link to="/register">

                                Register

                            </Link>

                        </p>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Login;
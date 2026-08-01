import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import api from "../api/axios";

function Register() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        username: "",
        email: "",
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

            await api.post(
                "auth/register/",
                form
            );

            alert("Registration Successful!");

            navigate("/login");

        }

        catch (error) {

            if (error.response?.data) {

                alert(
                    Object.values(error.response.data)
                        .flat()
                        .join("\n")
                );

            } else {

                alert("Registration Failed.");

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

                            Create Account

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

                            <div className="mb-3">

                                <label className="form-label">

                                    Email

                                </label>

                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    value={form.email}
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
                                    ? "Creating Account..."
                                    : "Register"}

                            </button>

                        </form>

                        <hr />

                        <p className="text-center mb-0">

                            Already have an account?{" "}

                            <Link to="/login">

                                Login

                            </Link>

                        </p>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Register;
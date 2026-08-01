import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";

function Login() {

    const navigate = useNavigate();

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

            alert("Login Successful");

            navigate("/products");

        }

        catch {

            alert("Invalid Credentials");

        }

    };

    return (

        <div className="col-md-5 mx-auto">

            <h2 className="mb-4">

                Login

            </h2>

            <form onSubmit={handleSubmit}>

                <input
                    className="form-control mb-3"
                    name="username"
                    placeholder="Username"
                    onChange={handleChange}
                />

                <input
                    className="form-control mb-3"
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                />

                <button className="btn btn-primary">

                    Login

                </button>

            </form>

        </div>

    );

}

export default Login;
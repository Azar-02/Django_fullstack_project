import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";

function Register() {

    const navigate = useNavigate();

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

        try {

            await api.post(
                "auth/register/",
                form
            );

            alert("Registration Successful");

            navigate("/login");

        }

        catch (error) {

            alert("Registration Failed");

            console.log(error);

        }

    };

    return (

        <div className="col-md-5 mx-auto">

            <h2 className="mb-4">

                Register

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
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                />

                <input
                    className="form-control mb-3"
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                />

                <button
                    className="btn btn-success"
                >

                    Register

                </button>

            </form>

        </div>

    );

}

export default Register;
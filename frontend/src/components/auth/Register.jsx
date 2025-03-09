import React, { useState } from "react";
import "./Register.css";
import Input from "./features/Input";
import Button from "./features/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const url = "http://localhost:8000/auth/register/";
    const [data, setData] = useState({
        username: "",
        first_name: "",
        last_name: "",
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    function handle(e) {
        const FormData = { ...data };
        FormData[e.target.name] = e.target.value;
        setData(FormData);
        console.log(FormData);
    }

    function handleSubmit(e) {
        e.preventDefault();
        axios
            .post(url, {
                username: data.username,
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                password: data.password,
            })
            .then((res) => {
                alert(res.data["message"]);
                navigate("/login");
            })
            .catch((err) => {
                const errorMessage =
                    err.response?.data?.detail ||
                    err.response?.data?.message ||
                    "Registration failed. Please try again.";
                alert(errorMessage);
            });
    }

    return (
        <div className="register">
            <form onSubmit={handleSubmit}>
                <h1>Register</h1>
                <Input
                    onChange={handle}
                    value={data.username}
                    type="text"
                    name="username"
                    placeholder="Username"
                />
                <Input
                    onChange={handle}
                    value={data.first_name}
                    type="text"
                    name="first_name"
                    placeholder="First Name"
                />
                <Input
                    onChange={handle}
                    value={data.last_name}
                    type="text"
                    name="last_name"
                    placeholder="Last Name"
                />
                <Input
                    onChange={handle}
                    value={data.email}
                    type="email"
                    name="email"
                    placeholder="Email"
                />
                <Input
                    onChange={handle}
                    value={data.password}
                    type="password"
                    name="password"
                    placeholder="Password"
                />
                <Button type="submit" action="Register" />
                <hr />
                <p>
                    Already have an account? <a href="/login">Login</a>
                </p>
            </form>
        </div>
    );
};

export default Register;

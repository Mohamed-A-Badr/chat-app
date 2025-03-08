import React, { useState } from "react";
import "./Login.css";
import Input from "./features/Input";
import Button from "./features/Button";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const url = "http://localhost:8000/auth/login/";
  const [data, setData] = useState({
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
    Axios.post(url, {
      email: data.email,
      password: data.password,
    })
      .then((res) => {
        console.log(res.status);
        localStorage.setItem("accessToken", res.data.access);
        localStorage.setItem("refreshToken", res.data.refresh);
        navigate("/");
      })
      .catch((err) => {
        alert(err.response.data["detail"]);
      });
  }

  return (
    <div className="login">
      <form onSubmit={(e) => handleSubmit(e)}>
        <h1>Login</h1>
        <Input
          onChange={(e) => handle(e)}
          value={data.email}
          type="email"
          name="email"
          placeholder="email"
        />
        <Input
          onChange={(e) => handle(e)}
          value={data.password}
          type="password"
          name="password"
          placeholder="password"
        />
        <Button type="submit" action="Login" />
        <hr />
        <p>
          Not a member? <a href="/register">Register</a>
        </p>
      </form>
    </div>
  );
};

export default Login;

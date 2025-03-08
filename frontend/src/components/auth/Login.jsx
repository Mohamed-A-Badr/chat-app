import React from "react";
import "./Login.css";
import Input from "./features/Input";
import Button from "./features/Button";

const Login = () => {
  return (
    <div className="login">
      <form method="POST">
        <h1>Login</h1>
        <Input type="email" name="email" placeholder="email" />
        <Input type="password" name="password" placeholder="password" />
        <Button type="submit" action="Login" />
        <hr />
        <p>
          Not a member? <a href="#">Register</a>
        </p>
      </form>
    </div>
  );
};

export default Login;

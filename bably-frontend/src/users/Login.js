import React, { useState } from "react";
import { Link } from "react-router-dom";
import Alerts from "../common/Alerts";

function Login({ login, setCurrPage }) {
  const INITIAL_STATE = {
    email: "",
    password: "",
  };

  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    let response = await login(formData);
    if (response.valid) {
      setFormData(INITIAL_STATE);
    } else setErrors(response.errors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({
      ...data,
      [name]: value.trim(),
    }));
  };

  return (
    <div className="card col-lg-4 col-md-5 col-sm-6 col-11">
      <div className="card-body">
        <h5 className="card-title">Welcome Back!</h5>
        {errors.length ? <Alerts msgs={errors} /> : null}
        <form onSubmit={handleSubmit}>
          <div className="form-floating my-4">
            <input
              className="form-control"
              type="text"
              name="email"
              id="email"
              value={formData.email}
              placeholder="email"
              required
              autoComplete="email"
              onChange={handleChange}
            />
            <label htmlFor="email">Email:</label>
          </div>
          <div className="form-floating mb-4">
            <input
              className="form-control"
              type="password"
              name="password"
              id="password"
              value={formData.password}
              placeholder="password"
              required
              autoComplete="current-password"
              onChange={handleChange}
            />
            <label htmlFor="password">Password:</label>
          </div>
          <button className="btn btn-bablyBlue form-control">Submit</button>
        </form>
        <p className="text-center mt-2">
          New to Bably?
          <span>
            <button
              className="btn btn-link"
              onClick={() => setCurrPage("signup")}
            >
              Sign up
            </button>
          </span>
        </p>
        <p className="text-center mt-2">
          Forgot password?
          <span className="ms-1">
            <Link to="/reset">Reset password</Link>
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;

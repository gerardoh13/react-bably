import React, { useState, useEffect } from "react";
import Alerts from "../common/Alerts";
import BablyApi from "../api";
import { useQuery } from "../hooks";
import { decodeToken } from "react-jwt";

function ResetPwd() {
  const INITIAL_STATE = {
    email: "",
    password: "",
    confirmPwd: "",
  };
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [email, setEmail] = useState("");
  const [msgs, setMsgs] = useState([]);
  const [errors, setErrors] = useState([]);
  const [token, setToken] = useState("");
  let query = useQuery();

  useEffect(() => {
    let queryToken = query.get("token");
    if (queryToken) {
      setToken(queryToken);
      let { email } = decodeToken(queryToken);
      setFormData((data) => ({
        ...data,
        email: email,
      }));
    }
  }, [query]);

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    setErrors([]);
    try {
      let response = await BablyApi.requestPwdReset({
        email: email.toLowerCase(),
      });
      if (response.emailSent) {
        setMsgs(["Email sent! Check your inbox."]);
      }
    } catch (e) {
      setErrors(e);
    }
    setFormData(INITIAL_STATE);
  };

  const handleSubmitNewPwd = async (e) => {
    e.preventDefault();
    setErrors([]);
    if (!confirmPasswords()) return;
    let data = structuredClone(formData);
    console.log(data);
    delete data.confirmPwd;
    try {
      let res = await BablyApi.resetPwd(token, data);
      if (res.passwordUpdated) setMsgs(["Password updated!"]);
    } catch (e) {
      console.log(e);
      setErrors(["Token is no longer valid"]);
    }
  };

  const confirmPasswords = () => {
    console.log("sdf");
    if (formData.password !== formData.confirmPwd) {
      setErrors(["Passwords do not match"]);
      return false;
    } else return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({
      ...data,
      [name]: value.trim(),
    }));
  };

  if (token) {
    return (
      <div className="card col-lg-4 col-md-5 col-sm-6 col-11 my-auto">
        <div className="card-body">
          <h5 className="card-title">Enter a new password </h5>
          {msgs.length ? <Alerts msgs={msgs} type="success" /> : null}
          {errors.length ? <Alerts msgs={errors} /> : null}
          <form onSubmit={handleSubmitNewPwd}>
            <div className="form-floating my-4">
              <input
                className="form-control"
                type="text"
                id="email"
                value={formData.email}
                placeholder="email"
                required
                disabled
                readOnly
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
            <div className="form-floating mb-3">
              <input
                className="form-control"
                type="password"
                name="confirmPwd"
                id="confirmPwd"
                value={formData.confirmPwd}
                placeholder="confirm password"
                autoComplete="confirm-password"
                required
                minLength="5"
                onChange={handleChange}
              />
              <label htmlFor="confirmPwd">Confirm Password</label>
            </div>
            <button className="btn btn-primary form-control">Submit</button>
          </form>
        </div>
      </div>
    );
  } else
    return (
      <div className="card col-lg-4 col-md-5 col-sm-6 col-11 my-auto">
        <div className="card-body">
          <h5 className="card-title text-center">
            Enter the email address asociated with your account
          </h5>
          {msgs.length ? <Alerts msgs={msgs} type="success" /> : null}
          {errors.length ? <Alerts msgs={errors} /> : null}
          <form onSubmit={handleSubmitRequest}>
            {!msgs.length ? (
              <>
                <div className="form-floating my-4">
                  <input
                    className="form-control"
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    placeholder="email"
                    required
                    autoComplete="email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <label htmlFor="email">Email:</label>
                </div>
                <button className="btn btn-primary form-control">Submit</button>
              </>
            ) : null}
          </form>
        </div>
      </div>
    );
}

export default ResetPwd;

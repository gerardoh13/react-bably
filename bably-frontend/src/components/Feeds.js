import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import BablyApi from "../api";
import UserContext from "../users/UserContext";

function Feeds() {
  const INITIAL_STATE = {
    method: "bottle",
    amount: 6,
    duration: "",
    fed_at: "",
    maxDateTime: "",
  };
  const [formData, setFormData] = useState(INITIAL_STATE);
  const { currChild } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    let now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    now.setMilliseconds(null);
    now.setSeconds(null);
    let currTime = now.toISOString().slice(0, -1);
    setFormData((data) => ({
      ...data,
      fed_at: currTime,
      maxDateTime: currTime,
    }));
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({
      ...data,
      [name]: value.trim(),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let fed_at = new Date(formData.fed_at).getTime() / 1000;
    let newFeed = { fed_at, method: formData.method, infant_id: currChild.id };
    if (formData.method === "bottle") {
      let amount = parseFloat(formData.amount);
      newFeed.amount = amount;
    } else {
      let duration = parseFloat(formData.duration);
      newFeed.duration = duration;
    }
    setFormData(INITIAL_STATE);
    console.log(newFeed);
    BablyApi.addFeed(newFeed)
    navigate("/");
  };
  return (
    <div className="card col-xl-3 col-lg-4 col-md-5 col-sm-6 col-11 my-auto text-center">
      <div className="card-body">
        <h5 className="card-title mb-3">Log New Feed</h5>
        <form method="POST" id="feedForm" onSubmit={handleSubmit}>
          <input
            type="radio"
            className="btn-check method"
            name="method"
            id="bottle"
            autoComplete="off"
            value="bottle"
            checked={formData.method === "bottle"}
            onChange={handleChange}
          />
          <label
            className="btn btn-outline-secondary radioLabel me-2"
            htmlFor="bottle"
          >
            Bottle
          </label>

          <input
            type="radio"
            className="btn-check method"
            name="method"
            id="nursing"
            autoComplete="off"
            value="nursing"
            checked={formData.method === "nursing"}
            onChange={handleChange}
          />
          <label
            className="btn btn-outline-secondary radioLabel"
            htmlFor="nursing"
          >
            Nursing
          </label>

          <div className="row mt-3">
            <div className="col">
              <label htmlFor="fed_at">Start Time:</label>
            </div>
            <div className="col">
              <input
                className="form-control"
                type="datetime-local"
                name="fed_at"
                id="fed_at"
                required
                value={formData.fed_at}
                max={formData.maxDateTime}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={`${formData.method === "nursing" ? "d-none" : ""}`}>
            <label htmlFor="amount" className="form-label">
              Amount:
            </label>
            <input
              type="range"
              name="amount"
              id="amount"
              className="form-range"
              step="0.25"
              min="1"
              max="12"
              onChange={handleChange}
              value={formData.amount}
            />
            <output>{formData.amount}</output>
            <span> oz</span>
          </div>
          <div
            className={`${
              formData.method === "bottle" ? "d-none" : "row mt-3"
            }`}
          >
            <div className="col">
              <label htmlFor="amount" className="form-label">
                Duration (mins):
              </label>
            </div>
            <div className="col">
              <input
                type="number"
                name="duration"
                id="duration"
                className="form-control"
                step="1"
                min="1"
                max="60"
                disabled={formData.method === "bottle"}
                value={formData.duration}
                onChange={handleChange}
                required={formData.method === "nursing"}
              />
            </div>
          </div>
          <button className="btn btn-success btn-lg form-control mt-3">
            Save
          </button>
        </form>
      </div>
    </div>
  );
}

export default Feeds;

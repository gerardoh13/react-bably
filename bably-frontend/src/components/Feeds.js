import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Feeds() {
  const INITIAL_STATE = {
    method: "bottle",
    amount: 6,
  };
  const [formData, setFormData] = useState(INITIAL_STATE);
  const navigate = useNavigate();

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
    let newFeed = { fed_at: formData.fed_at, method: formData.method, tz };
    if (formData.method === "bottle") {
      let amount = parseFloat(formData.amount);
      newFeed.amount = amount;
    } else {
      let duration = parseFloat(formData.duration);
      newFeed.duration = duration;
    }
    console.log(newFeed);
    navigate("/");
  };
  return (
    <div className="my-auto card text-center">
      <div className="card-body">
        <h5 className="card-title">Log Feed</h5>
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
                onChange={handleChange}
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

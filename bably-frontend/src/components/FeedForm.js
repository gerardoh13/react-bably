import React, { useState, useEffect, useContext } from "react";
import UserContext from "../users/UserContext";
import Modal from "react-bootstrap/Modal";

function FeedForm({ show, setShow, submit, onDelete, feed }) {
  let INITIAL_STATE = {
    method: "bottle",
    amount: 6,
    duration: "",
    fed_at: "",
    maxDateTime: "",
  };

  const [formData, setFormData] = useState(INITIAL_STATE);
  const { currChild } = useContext(UserContext);

  useEffect(() => {
    if (show && !feed) {
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
    } else if (show && feed) {
      let date = new Date(feed.fed_at * 1000);
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      date.setMilliseconds(null);
      date.setSeconds(null);
      setFormData({
        method: feed.method,
        amount: feed.amount || "",
        duration: feed.duration || "",
        fed_at: date.toISOString().slice(0, -1),
      });
    }
  }, [show, feed]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({
      ...data,
      [name]: value.trim(),
    }));
  };

  const resetForm = () => {
    setFormData(INITIAL_STATE);
    setShow(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // let tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let fed_at = new Date(formData.fed_at).getTime() / 1000;
    let newFeed = { fed_at, method: formData.method, infant_id: currChild.id };
    if (formData.method === "bottle") {
      let amount = parseFloat(formData.amount);
      newFeed.amount = amount;
    } else {
      let duration = parseFloat(formData.duration);
      newFeed.duration = duration;
    }
    if (feed) await submit(feed.id, newFeed);
    else await submit(newFeed);
    resetForm();
  };
  return (
    <Modal show={show} centered>
      <Modal.Header>
        <Modal.Title>{feed ? "Edit" : "Log New"} Feed</Modal.Title>
        <button
          className="btn-close"
          aria-label="Close"
          onClick={resetForm}
        ></button>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className="text-center">
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

          <div className="row mt-3 px-3">
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
          <div className="row mt-3">
            <button
              type="button"
              className="btn btn-secondary form-control col me-2"
              data-bs-dismiss="modal"
              onClick={resetForm}
            >
              Cancel
            </button>
            {feed ? (
              <button
                type="button"
                className="btn btn-danger form-control col me-2"
                onClick={() => onDelete(feed.id, "feed")}
              >
                Delete
              </button>
            ) : null}
            <button className="btn btn-success col form-control">
              {feed ? "Edit" : "Log"} Feed
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default FeedForm;

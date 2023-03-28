import React, { useState, useEffect, useContext } from "react";
import UserContext from "../users/UserContext";
import Modal from "react-bootstrap/Modal";

function DiaperForm({ show, setShow, submit, diaper }) {
  const INITIAL_STATE = {
    type: "dry",
    size: "light",
    changed_at: "",
    maxDateTime: "",
  };
  const [formData, setFormData] = useState(INITIAL_STATE);
  const { currChild } = useContext(UserContext);

  useEffect(() => {
    if (show && !diaper) {
      let now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      now.setMilliseconds(null);
      now.setSeconds(null);
      let currTime = now.toISOString().slice(0, -1);
      setFormData((data) => ({
        ...data,
        changed_at: currTime,
        maxDateTime: currTime,
      }));
    } else if (show && diaper) {
      let date = new Date(diaper.changed_at * 1000);
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      date.setMilliseconds(null);
      date.setSeconds(null);
      setFormData({
        type: diaper.type,
        size: diaper.size,
        changed_at: date.toISOString().slice(0, -1),
      });
    }
  }, [show, diaper]);

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
    // const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const changed_at = new Date(formData.changed_at).getTime() / 1000;
    const newDiaper = {
      changed_at,
      type: formData.type,
      infant_id: currChild.id,
    };
    if (formData.type === "dry") {
      newDiaper.size = "light";
    } else {
      newDiaper.size = formData.size;
    }
    if (diaper) await submit(diaper.id, newDiaper);
    else await submit(newDiaper);
    resetForm();
  };
  return (
    <Modal show={show} centered>
      <Modal.Header>
        <Modal.Title> {diaper ? "Edit" : "Log New"} Diaper Change</Modal.Title>
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
            className="btn-check"
            name="type"
            id="dry"
            autoComplete="off"
            value="dry"
            checked={formData.type === "dry"}
            onChange={handleChange}
          />
          <label className="btn btn-outline-secondary" htmlFor="dry">
            Dry
          </label>

          <input
            type="radio"
            className="btn-check"
            name="type"
            id="wet"
            autoComplete="off"
            value="wet"
            checked={formData.type === "wet"}
            onChange={handleChange}
          />
          <label className="btn btn-outline-secondary mx-2" htmlFor="wet">
            Wet
          </label>

          <input
            type="radio"
            className="btn-check"
            name="type"
            id="soiled"
            autoComplete="off"
            value="soiled"
            checked={formData.type === "soiled"}
            onChange={handleChange}
          />
          <label className="btn btn-outline-secondary" htmlFor="soiled">
            Soiled
          </label>

          <input
            type="radio"
            className="btn-check"
            name="type"
            id="mixed"
            autoComplete="off"
            value="mixed"
            checked={formData.type === "mixed"}
            onChange={handleChange}
          />
          <label className="btn btn-outline-secondary ms-2" htmlFor="mixed">
            Mixed
          </label>

          <div className={`${formData.type !== "dry" ? "mt-3" : "d-none"}`}>
            <input
              type="radio"
              className="btn-check"
              name="size"
              id="light"
              autoComplete="off"
              value="light"
              checked={formData.size === "light"}
              onChange={handleChange}
            />
            <label className="btn btn-outline-secondary ms-2" htmlFor="light">
              Light
            </label>
            <input
              type="radio"
              className="btn-check"
              name="size"
              id="medium"
              autoComplete="off"
              value="medium"
              checked={formData.size === "medium"}
              onChange={handleChange}
            />
            <label className="btn btn-outline-secondary ms-2" htmlFor="medium">
              Medium
            </label>
            <input
              type="radio"
              className="btn-check"
              name="size"
              id="heavy"
              autoComplete="off"
              value="heavy"
              checked={formData.size === "heavy"}
              onChange={handleChange}
            />
            <label className="btn btn-outline-secondary ms-2" htmlFor="heavy">
              Heavy
            </label>
          </div>

          <div className="row mt-3">
            <div className="col">
              <label htmlFor="changed_at">Change Time:</label>
            </div>
            <div className="col">
              <input
                className="form-control"
                type="datetime-local"
                name="changed_at"
                id="changed_at"
                required
                value={formData.changed_at}
                max={formData.maxDateTime}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="row mt-3 px-3">
            <button
              type="button"
              className="btn btn-secondary form-control col me-2"
              data-bs-dismiss="modal"
              onClick={resetForm}
            >
              Close
            </button>
            <button className="btn btn-success col form-control">
              {diaper ? "Edit" : "Log"} Diaper
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default DiaperForm;

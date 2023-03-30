import React, { useState, useEffect } from "react";
import UserContext from "../users/UserContext";
import Modal from "react-bootstrap/Modal";

function EditChildForm({ show, setShow, child }) {
  const [formData, setFormData] = useState({
    firstName: child.firstName,
    dob: child.dob.slice(0, 10),
    gender: child.gender,
  });

  useEffect(() => {
    setFormData({
      firstName: child.firstName,
      dob: child.dob.slice(0, 10),
      gender: child.gender,
    });
  }, [show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({
      ...data,
      [name]: value.trim(),
    }));
  };

  const resetForm = () => {
    setShow(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    // resetForm();
  };
  return (
    <Modal show={show} centered>
      <Modal.Header>
        <Modal.Title>Edit Profile</Modal.Title>
        <button
          className="btn-close"
          aria-label="Close"
          onClick={resetForm}
        ></button>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className="text-centers">
          <div className="form-floating">
            <input
              type="text"
              className="form-control"
              id="firstName"
              name="firstName"
              placeholder="Child's First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <label htmlFor="firstName">First Name</label>
            <div className="invalid-feedback">
              Please enter your child's name.
            </div>
          </div>
          <br />
          <div className="text-center">

          <small className="me-2">Gender:</small>

          <input
            type="radio"
            className="btn-check gender"
            name="gender"
            id="boy"
            autoComplete="off"
            checked={formData.gender === "male"}
            value="male"
            required
            onChange={handleChange}
          />
          <label className="btn btn-outline-dark me-2" htmlFor="boy">
            <i className="bi bi-gender-male"></i> Boy
          </label>
          <input
            type="radio"
            className="btn-check gender"
            name="gender"
            id="girl"
            autoComplete="off"
            checked={formData.gender === "female"}
            value="female"
            onChange={handleChange}
          />
          <label className="btn btn-outline-dark" htmlFor="girl">
            <i className="bi bi-gender-female"></i> Girl
          </label>
          </div>
          <br />
          <label className="text-start" htmlFor="dob">
            Date of Birth
          </label>
          <input
            className="form-control"
            type="date"
            name="dob"
            id="dob"
            value={formData.dob}
            onChange={handleChange}
            required
          />
          <div className="invalid-feedback">
            Please enter your child's date of birth.
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
            <button className="btn btn-success col form-control">
              Save Changes
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default EditChildForm;

import React from "react";

function StepOne({ data, handleChange }) {
  return (
    <div className="tab needs-validation">
      <h4 className="my-4">How shall we refer to your child?</h4>

      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          id="firstName"
          name="firstName"
          placeholder="Child's First Name"
          value={data.firstName}
          onChange={handleChange}
          required
        />
        <label htmlFor="firstName">Child's First Name</label>
        <div className="invalid-feedback">Please enter your child's name.</div>
      </div>
      <hr className="my-4" />
      <small className="">Select your child's gender</small>
      <br />
        <input
          type="radio"
          className="btn-check gender"
          name="gender"
          id="boy"
          autoComplete="off"
          checked={data.gender === "male"}
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
          checked={data.gender === "female"}
          value="female"
          onChange={handleChange}
        />
        <label className="btn btn-outline-dark" htmlFor="girl">
          <i className="bi bi-gender-female"></i> Girl
        </label>
        <div className="invalid-feedback">
          Please select your child's gender.
        </div>
    </div>
  );
}

export default StepOne;

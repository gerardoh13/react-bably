import React from "react";

function StepTwo({ data, handleChange }) {
  return (
    <div className="tab needs-validation">
      <h4 className="my-4">What is your child's date of birth?</h4>
      <p>We use this information to provide age-appropriate guidance.</p>
      <input
        className="form-control"
        type="date"
        name="dob"
        id="dob"
        value={data.dob}
        onChange={handleChange}
        required
      />
      <div className="invalid-feedback">
        Please enter your child's date of birth.
      </div>
    </div>
  );
}

export default StepTwo;

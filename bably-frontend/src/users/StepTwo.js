import React from "react";

function StepTwo({ data, handleChange, changeStep }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (data.dob) changeStep(1);
  };
  return (
    <form className="needs-validation" onSubmit={handleSubmit}>
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
      <div className="row">
        <button
          className="btn btn-bablyGreen mt-3 me-2 form-control col"
          onClick={() => changeStep(-1)}
        >
          Previous
        </button>
        <button className="btn btn-bablyGreen mt-3 form-control col">Next</button>
      </div>
    </form>
  );
}

export default StepTwo;

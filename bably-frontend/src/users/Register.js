import React, { useState } from "react";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import "./Register.css";

function Register() {
  const INITIAL_STATE = {
    childName: "",
    gender: "",
    dob: "",
  };
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(INITIAL_STATE);

  const navigate = (n) => {
    setStep((prev) => prev + n);
    console.log(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const trimCheck = name === "childName";
    setFormData((data) => ({
      ...data,
      [name]: trimCheck ? value.trimStart().replace(/\s+/g, " ") : value,
    }));
  };

  let currStep;
  switch (step) {
    case 0:
      currStep = <StepOne data={formData} handleChange={handleChange} />;
      break;
    case 1:
      currStep = <StepTwo data={formData} handleChange={handleChange} />;
      break;
    case 2:
      break;
    case 3:
      currStep = (
        <div>
          <h3>Almost done!</h3>
          <h4>Bably uses push notifications to send you feeding reminders</h4>
          <p>When prompted, please allow notifications.</p>
          <p>
            You can always disable notifications, or turn them off during the
            night from the reminder settings page.
          </p>
        </div>
      );
      break;
    default:
  }

  return (
    <>
      <div className="card col-lg-4 col-md-5 col-sm-6 col-11 my-auto text-center">
        <div className="card-body">
          {currStep}
          <div className="row">
            {step ? (
              <div className="col">
                <button
                  className="btn btn-success mt-3 form-control"
                  id="prevBtn"
                  onClick={() => navigate(-1)}
                >
                  Previous
                </button>
              </div>
            ) : null}

            <div className="col">
              {step < 3 ? (
                <button
                  className="btn btn-success mt-3 form-control"
                  id="nextBtn"
                  onClick={() => navigate(1)}
                >
                  Next
                </button>
              ) : (
                <button
                  className="btn btn-success mt-3 form-control"
                  id="nextBtn"
                  onClick={() => console.log(formData)}
                >
                  Submit
                </button>
              )}
            </div>
            <div className="mt-2">
              <span
                className={`step ${
                  formData.childName && formData.gender ? "finish" : ""
                } ${step === 0 ? "active" : ""}`}
              ></span>
              <span
                className={`step ${formData.dob ? "finish" : ""} ${
                  step === 1 ? "active" : ""
                }`}
              ></span>
              <span className={`step ${step === 2 ? "active" : ""}`}></span>
              <span className={`step ${step === 3 ? "active" : ""}`}></span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;

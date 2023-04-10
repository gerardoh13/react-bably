import React, { useState, useContext } from "react";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import UserContext from "../users/UserContext";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register({ additionalChild }) {
  const INITIAL_STATE = {
    firstName: "",
    gender: "",
    dob: "",
    publicId: "",
  };
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(INITIAL_STATE);
  const { registerInfant } = useContext(UserContext);
  const navigate = useNavigate();

  const changeStep = (n) => {
    setStep((prev) => prev + n);
  };

  const submit = async () => {
    console.log(formData);
    await registerInfant(formData);
    navigate("/");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const trimCheck = name === "firstName";
    setFormData((data) => ({
      ...data,
      [name]: trimCheck ? value.trimStart().replace(/\s+/g, " ") : value,
    }));
  };

  let currStep;
  switch (step) {
    case 0:
      currStep = (
        <StepOne
          data={formData}
          handleChange={handleChange}
          changeStep={changeStep}
        />
      );
      break;
    case 1:
      currStep = (
        <StepTwo
          data={formData}
          handleChange={handleChange}
          changeStep={changeStep}
        />
      );
      break;
    case 2:
      currStep = (
        <StepThree
          data={formData}
          setFormData={setFormData}
          changeStep={changeStep}
          additionalChild
          submit={submit}
        />
      );
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
          <div className="row">
            <button
              className="btn btn-success mt-3 me-2 form-control col"
              onClick={() => changeStep(-1)}
            >
              Previous
            </button>
            <button
              className="btn btn-success mt-3 form-control col"
              onClick={submit}
            >
              Sumbit
            </button>
          </div>
        </div>
      );
      break;
    default:
  }

  return (
    <>
      <div className="card my-auto text-center">
        <div className="card-body">
          {currStep}
          <div className="row">
            <div className="mt-2">
              <span
                className={`step ${
                  formData.firstName && formData.gender ? "finish" : ""
                } ${step === 0 ? "active" : ""}`}
              ></span>
              <span
                className={`step ${formData.dob ? "finish" : ""} ${
                  step === 1 ? "active" : ""
                }`}
              ></span>
              <span
                className={`step ${step === 2 ? "active finish" : ""}`}
              ></span>

              {additionalChild ? null : (
                <span className={`step ${step === 3 ? "active" : ""}`}></span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;

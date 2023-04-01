import React, { useContext, useState } from "react";
import UserContext from "../users/UserContext";
import Milestones from "./Milestones";
import EditChildForm from "./EditChildForm";

function Profile() {
  const { currChild } = useContext(UserContext);
  const [showForm, setShowForm] = useState(false);

  const [age, setAge] = useState({
    years: 0,
    months: 0,
    days: 0,
  });

  const getMonthsFromNow = (date) => {
    let now = new Date();
    const monthDiff = date.getMonth() - now.getMonth();
    const yearDiff = date.getYear() - now.getYear();
    return Math.abs(monthDiff + yearDiff * 12);
  };
  let months = getMonthsFromNow(new Date(currChild.dob));

  return (
    <>
      <EditChildForm show={showForm} setShow={setShowForm} child={currChild} />
      <div className="col-11 col-lg-5 mt-3 card text-center">
        <div className="card-body">
          <div className="row">

          {currChild.publicId ? (
            <div className="col">
            <img
              className="profileImg rounded"
              src={`https://res.cloudinary.com/dolnu62zm/image/upload/${currChild.publicId}`}
              alt={currChild.firstName}
            />
              </div>
          ) : null}
          <div className="col">
          <h1 className="card-title">{currChild.firstName}</h1>

            <button className="btn btn-bablyGreen" onClick={() => setShowForm(true)}>
              Edit Profile
            </button>
          </div>
          </div>

          <div className="text-start mt-4 mx-lg-4">
            <Milestones gender={currChild.gender} months={months} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;

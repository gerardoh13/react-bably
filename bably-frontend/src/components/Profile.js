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
      <div className="col-11 col-lg-6 mt-3 card text-center">
        <div className="card-body">
          {currChild.publicId ? (
            <img
              className="profileImg"
              src={`https://res.cloudinary.com/dolnu62zm/image/upload/${currChild.publicId}`}
              alt={currChild.firstName}
            />
          ) : null}
          <h2 className="card-title">{currChild.firstName}</h2>
          <div>
            <button className="btn btn-info" onClick={() => setShowForm(true)}>
              Edit Profile
            </button>
          </div>
          <div className="text-start">
            <Milestones gender={currChild.gender} months={months} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;

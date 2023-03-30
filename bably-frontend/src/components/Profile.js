import React, { useContext } from "react";
import UserContext from "../users/UserContext";
import Milestones from "./Milestones";

function Profile() {
  let { currChild} = useContext(UserContext);

  const getMonthsFromNow = (date) => {
    let now = new Date();
    const monthDiff = date.getMonth() - now.getMonth();
    const yearDiff = date.getYear() - now.getYear();
    return Math.abs(monthDiff + yearDiff * 12);
  };
  let months = getMonthsFromNow(new Date(currChild.dob));

  return (
    <div className="col-11 col-lg-6 mt-3 card text-center">
      <div className="card-body">
        <h2 className="card-title">{currChild.firstName}</h2>
        <div>
          <button className="btn btn-info col">Edit Profile</button>
        </div>
        <div className="text-start">
          <Milestones gender={currChild.gender} months={months} />
        </div>
      </div>
    </div>
  );
}

export default Profile;

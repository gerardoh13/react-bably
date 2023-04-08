import React, { useContext, useState, useEffect } from "react";
import UserContext from "../users/UserContext";
import Milestones from "./Milestones";
import EditChildForm from "./EditChildForm";
import { DateTime } from "luxon";

function Profile() {
  const { currChild } = useContext(UserContext);
  const [showForm, setShowForm] = useState(false);

  const [age, setAge] = useState({
    years: 0,
    months: 0,
    days: 0,
    totalMonths: 0,
  });
  useEffect(() => {
    const dobISO = new Date(currChild.dob).toISOString();
    const now = DateTime.now();
    const dob = DateTime.fromISO(dobISO);
    const diff = now.diff(dob, ["years", "months", "days"]);
    const totalMonths = diff.years
      ? diff.years * 12 + diff.months
      : diff.months;
    setAge({
      years: diff.years,
      months: diff.months,
      days: Math.floor(diff.days),
      totalMonths: totalMonths,
    });
  }, [currChild]);

  const prettyAge = () => {
    let years = age.years
      ? `${age.years} ${formatPlurals(age.years, "year")}`
      : "";
    let months = age.months
      ? `${age.months} ${formatPlurals(age.months, "month")}`
      : "";
    let days = age.days ? `${age.days} ${formatPlurals(age.days, "day")}` : "";
    if (years && (months || days)) years += ",";
    if (months && days) months += ",";
    if (years || months) days = "and " + days;
    let formattedAge = `${years} ${months} ${days}`;
    return formattedAge;
  };

  const formatPlurals = (num, unit) => {
    return num > 1 ? unit + "s" : unit;
  };
  return (
    <>
      <EditChildForm show={showForm} setShow={setShowForm} child={currChild} />
      <div className="col-11 col-lg-6 col-xxl-5 mt-3 card text-center">
        <div className="card-body">
          <div className="row mt-3">
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
              <p>
                Date of Birth: {new Date(currChild.dob).toLocaleDateString()}
              </p>
              <p>
                {currChild.firstName} is {prettyAge()} old!
              </p>
              <button
                className="btn btn-bablyGreen"
                onClick={() => setShowForm(true)}
              >
                Edit Profile
              </button>
            </div>
          </div>

          <div className="text-start mt-4 mx-lg-5">
            <Milestones gender={currChild.gender} months={age.totalMonths} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;

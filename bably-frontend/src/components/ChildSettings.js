import React, { useState, useEffect } from "react";
import Alerts from "../common/Alerts";
import Dropdown from "react-bootstrap/Dropdown";
import BablyApi from "../api";

function ChildSettings({ infants, user }) {
  const [msgs, setMsgs] = useState([]);
  const [infant, setInfant] = useState(null);
  const [email, setEmail] = useState("");
  const [crud, setCrud] = useState(false);

  useEffect(() => {
    if (infants[0]) setInfant(infants[0]);
  }, [infants]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsgs([]);
    let details = await BablyApi.addUser(infant.id, {
      email: email.toLowerCase(),
      sentBy: user.firstName,
    });
    console.log(details);
    if (details.inviteSent) {
      setMsgs([`'${email}' doesn't have an account, we sent them an invite!`]);
    } else {
      setMsgs([
        `${details.recipient} now has access to ${infant.firstName}${
          infant.firstName.endsWith("s") ? "'" : "'s"
        } profile!`,
      ]);
    }
    setEmail("");
  };

  const changeChild = (id) => {
    let child = infants.filter((i) => i.id === id);
    setInfant(child[0]);
  };

  return (
    <>
      {infant ? (
        <>
          <div className="btn-group">
            <h3 className="me-4">Access settings for {infant.firstName}</h3>
            {infants.length > 1 ? (
              <Dropdown>
                <Dropdown.Toggle variant="bablyBlue" id="dropdown-basic">
                  Change Child
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {infants.map((i) => (
                    <Dropdown.Item key={i.id} onClick={() => changeChild(i.id)}>
                      {i.firstName}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            ) : null}
          </div>
          <form onSubmit={handleSubmit} className="text-center">
            <hr />
            <span className="my-5 ms-1 fw-bold">
              Grant access to another user
            </span>
            <br />
            <span>
              Permissions:{" "}
              {crud
                ? "Add, update and delete feeds and diapers"
                : "Add feeds and diapers"}
            </span>
            <div className="my-3">
              <input
                type="radio"
                className="btn-check"
                name="access"
                id="babysitter"
                checked={!crud}
                onChange={() => setCrud((prev) => !prev)}
              />
              <label
                className="btn btn-outline-secondary me-3"
                htmlFor="babysitter"
              >
                Babysitter
              </label>
              <input
                type="radio"
                className="btn-check"
                name="access"
                id="caregiver"
                checked={crud}
                onChange={() => setCrud((prev) => !prev)}
              />
              <label className="btn btn-outline-secondary" htmlFor="caregiver">
                Caregiver
              </label>
            </div>

            <div className="text-center mt-2">
              {msgs.length ? <Alerts msgs={msgs} type="primary" /> : null}
            </div>
            <div className="input-group input-group-lg mb-3">
              <input
                className="form-control"
                type="email"
                id="email"
                value={email}
                placeholder="email"
                required
                onChange={(e) => setEmail(e.target.value.trim())}
              />
              <button className="btn btn-bablyGreen">Send</button>
            </div>
          </form>
        </>
      ) : (
        <>
          <h3 className="text-center">These settings are restricted to admin users</h3>
        </>
      )}
    </>
  );
}

export default ChildSettings;

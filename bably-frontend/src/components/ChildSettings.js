import React, { useState, useEffect } from "react";
import Alerts from "../common/Alerts";
import { Link } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import BablyApi from "../api";

function ChildSettings({ infants }) {
  const [msgs, setMsgs] = useState([]);
  const [infant, setInfant] = useState({ id: 0, firstName: "" });
  const [email, setEmail] = useState("");
  useEffect(() => {
    setInfant(infants[0]);
  }, [infants]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsgs([])
    let details = await BablyApi.addUser(infant.id, {
      email: email.toLowerCase(),
    });
    console.log(details);
    if (details.inviteSent) {
      setMsgs([`'${email}' doesn't have an account, we sent them an invite!`]);
    } else {
      setMsgs([`${details.recipient} now has access to ${infant.firstName}${infant.firstName.endsWith("s") ? "'" : "'s"} profile!`]);
    }
    setEmail("");
  };

  const changeChild = (id) => {
    let child = infants.filter((i) => i.id === id);
    console.log(child[0]);
    setInfant(child[0]);
  };

  return (
    <>
      <h2 className="mb-4">Settings for {infant.firstName}</h2>
      <div className="row mb-4">
        <div className="col text-start">
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
        <div className="col text-end">
          <Link to="/register" className="btn btn-primary">
            Register a child
          </Link>
        </div>
      </div>

      <span className="my-5 ms-1">
        Give access to {infant.firstName}
        {infant.firstName.endsWith("s") ? "'" : "'s"} profile to another user
      </span>
      <form onSubmit={handleSubmit}>
        <div className="text-center mt-2">
          {msgs.length ? <Alerts msgs={msgs} type="primary" /> : null}
        </div>

        <div className="form-floating my-4">
          <input
            className="form-control"
            type="email"
            id="email"
            value={email}
            placeholder="email"
            required
            onChange={(e) => setEmail(e.target.value.trim())}
          />
          <label htmlFor="email">Email:</label>
        </div>
        <div className="text-end">
          <button className="btn btn-success">Submit</button>
        </div>
      </form>
    </>
  );
}

export default ChildSettings;

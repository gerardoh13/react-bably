import React, { useState, useEffect } from "react";
import Alerts from "../common/Alerts";
import Dropdown from "react-bootstrap/Dropdown";
import BablyApi from "../api";
import Permissions from "./Permissions";

function AccessSettings({ infants, user, setInfants, setChangeCount }) {
  const [msgs, setMsgs] = useState([]);
  const [infant, setInfant] = useState(null);
  const [email, setEmail] = useState("");
  const [crud, setCrud] = useState(false);

  useEffect(() => {
    if (infants.length) {
      setInfant(infants[0]);
    }
  }, [infants]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsgs([]);
    try {
      let details = await BablyApi.addUser(infant.id, {
        sentTo: email.toLowerCase(),
        sentByName: user.firstName,
        sentById: user.id,
        infantName: `${infant.firstName}${
          infant.firstName.endsWith("s") ? "'" : "'s"
        }`,
        crud: crud,
      });
      console.log(details);
      if (details.inviteSent) {
        setMsgs([
          `'${email}' doesn't have an account, we sent them an invite!`,
        ]);
      } else {
        if (details.previouslyAdded)
          setMsgs([
            `${details.recipient} already has access to ${infant.firstName}${
              infant.firstName.endsWith("s") ? "'" : "'s"
            } profile.`,
          ]);
        else {
          setMsgs([
            `${details.recipient} now has access to ${infant.firstName}${
              infant.firstName.endsWith("s") ? "'" : "'s"
            } profile!`,
          ]);
          setChangeCount((prev) => prev + 1);
        }
      }
    } catch (e) {
      console.log(e);
    }

    setEmail("");
  };

  const changeChild = (id) => {
    let child = infants.find((i) => i.id === id);
    setInfant(child);
  };

  const updateNotifications = async (userId, infantId, checked) => {
    const notify = await BablyApi.updateNotifications(userId, infantId, {
      notifyAdmin: !checked,
    });
    let child = infants.find((i) => i.id === notify.infantId);
    let childIndex = infants.findIndex((i) => i.id === notify.infantId);
    let user = child.users.find((u) => u.userId === notify.userId);
    user.notifyAdmin = notify.notifyAdmin;
    const updatedChildList = infants.map((c, i) => {
      if (i === childIndex) {
        return child;
      } else {
        return c;
      }
    });
    setInfants(updatedChildList);
  };

  const updateAccess = async (userId, infantId, crud) => {
    const access = await BablyApi.updateAcess(userId, infantId, {
      crud: crud,
    });
    let child = infants.find((i) => i.id === access.infantId);
    let childIndex = infants.findIndex((i) => i.id === access.infantId);
    let user = child.users.find((u) => u.userId === access.userId);
    user.crud = access.crud;
    const updatedChildList = infants.map((c, i) => {
      if (i === childIndex) {
        return child;
      } else {
        return c;
      }
    });
    setInfants(updatedChildList);
  };

  const removeAccess = async (userId, infantId) => {
    const removed = await BablyApi.removeAcess(userId, infantId);
    if (removed === userId) {
      let child = infants.find((i) => i.id === infantId);
      let childIndex = infants.findIndex((i) => i.id === infantId);
      let users = child.users.filter((u) => u.userId !== userId);
      child.users = users;
      const updatedChildList = infants.map((c, i) => {
        if (i === childIndex) {
          return child;
        } else {
          return c;
        }
      });
      setInfants(updatedChildList);
    }
  };

  return (
    <>
      {infant ? (
        <>
          <div className="d-flex justify-content-center">
            <h4 className="me-2 mt-1 text-center">Access settings for</h4>
            {infants.length > 1 ? (
              <Dropdown>
                <Dropdown.Toggle variant="bablyBlue" className="fs-5">
                  {infant.firstName}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {infants.map((i) => (
                    <Dropdown.Item key={i.id} onClick={() => changeChild(i.id)}>
                      {i.firstName}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <h4 className="mt-1">{infant.firstName}</h4>
            )}
          </div>
          <form onSubmit={handleSubmit} className="text-center">
            <hr />
            {msgs.length ? <Alerts msgs={msgs} type="primary" /> : null}
            <span className="fw-bold">Grant access to another user</span>
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
                Guardian
              </label>
            </div>
            <div className="input-group mb-3">
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
          {infant.users.length ? (
            <Permissions
              infant={infant}
              updateNotifications={updateNotifications}
              updateAccess={updateAccess}
              removeAccess={removeAccess}
            />
          ) : null}
        </>
      ) : (
        <>
          <h3 className="text-center">
            These settings are restricted to admin users
          </h3>
        </>
      )}
    </>
  );
}

export default AccessSettings;

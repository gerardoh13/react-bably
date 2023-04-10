import React, { useState, useEffect, useContext } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import BablyApi from "../api";
import Reminders from "./Reminders";
import UserContext from "../users/UserContext";
import ChildSettings from "./ChildSettings";
import Register from "../users/Register";

function Settings() {
  const [key, setKey] = useState("reminders");
  const [reminders, setReminders] = useState(null);
  const [infants, setInfants] = useState(null);
  const [adminAccess, setAdminAccess] = useState(true)
  const { currUser } = useContext(UserContext);

  useEffect(() => {
    setReminders(currUser.reminders);
    let adminAccessInfants = currUser.infants.filter((i) => i.userIsAdmin);
    setInfants(adminAccessInfants);
    if (!adminAccessInfants.length) setAdminAccess(false)
  }, [currUser.reminders, currUser.infants]);

  const updateReminders = async (data) => {
    let res = await BablyApi.updateReminders(currUser.email, data);
    return res;
  };

  return (
    <div className="card col-11 col-lg-6 col-xxl-5 my-auto">
      <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
      >
        <Tab eventKey="reminders" title="Reminders">
          <div className="card-body">
            {reminders ? (
              <Reminders reminders={reminders} update={updateReminders} />
            ) : null}
          </div>
        </Tab>
        {adminAccess ? <Tab eventKey="access" title="Access">
          <div className="card-body">
            {reminders ? (
              <ChildSettings infants={infants} user={currUser} />
            ) : null}
          </div>
        </Tab> : null}
        <Tab eventKey="register" title="Register Child">
          <Register additionalChild />
        </Tab>
      </Tabs>
    </div>
  );
}

export default Settings;

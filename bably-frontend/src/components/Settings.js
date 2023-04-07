import React, { useState, useEffect, useContext } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import BablyApi from "../api";
import Reminders from "./Reminders";
import UserContext from "../users/UserContext";

function Settings() {
  const [key, setKey] = useState("reminders");
  const [reminders, setReminders] = useState(null);
  const { currUser } = useContext(UserContext);

  useEffect(() => {
    setReminders(currUser.reminders);
  }, [currUser]);

  const updateReminders = async (data) => {
    let res = await BablyApi.updateReminders(currUser.email, data);
    return res;
  };

  return (
    <div className="card col-11 col-lg-6 my-auto">
      <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
      >
        <Tab eventKey="infants" title="Infants">
          <h1>Infants</h1>
        </Tab>
        <Tab eventKey="reminders" title="Reminders">
          <div className="card-body">
            {reminders ? (
              <Reminders reminders={reminders} update={updateReminders} />
            ) : null}
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}

export default Settings;

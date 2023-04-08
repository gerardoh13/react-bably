import React, { useState, useEffect, useContext } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import BablyApi from "../api";
import Reminders from "./Reminders";
import UserContext from "../users/UserContext";
import ChildSettings from "./ChildSettings";

function Settings() {
  const [key, setKey] = useState("infants");
  const [reminders, setReminders] = useState(null);
  const [infants, setInfants] = useState(null);
  const { currUser } = useContext(UserContext);

  useEffect(() => {
    setReminders(currUser.reminders);
    setInfants(currUser.infants);
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
        <Tab eventKey="infants" title="Infants">
          <div className="card-body">
            {reminders ? <ChildSettings infants={infants} /> : null}
          </div>
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

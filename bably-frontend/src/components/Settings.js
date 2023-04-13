import React, { useState, useEffect, useContext } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import BablyApi from "../api";
import Reminders from "./Reminders";
import UserContext from "../users/UserContext";
import ChildSettings from "./AccessSettings";
import Register from "../users/Register";

function Settings() {
  const [key, setKey] = useState("reminders");
  const [reminders, setReminders] = useState(null);
  const [infants, setInfants] = useState([]);
  const [adminAccess, setAdminAccess] = useState(true);
  const { currUser } = useContext(UserContext);

  useEffect(() => {
    async function getAuthUsers() {
      let adminAccessInfants = currUser.infants.filter((i) => i.userIsAdmin);
      if (!adminAccessInfants.length) {
        setAdminAccess(false);
        return;
      }
      adminAccessInfants = await Promise.all(
        adminAccessInfants.map(async (i) => {
          i.users = await BablyApi.getAuthorizedUsers(i.id);
          return i;
        })
      );
      setInfants(adminAccessInfants);
    }
    setReminders(currUser.reminders);
    getAuthUsers();
  }, [currUser.reminders, currUser.infants]);

  const updateReminders = async (data) => {
    let res = await BablyApi.updateReminders(currUser.email, data);
    return res;
  };

  return (
    <div className="card col-12 col-lg-6 col-xxl-5 my-auto">
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
        {adminAccess ? (
          <Tab eventKey="access" title="Access">
            <div className="card-body">
              {reminders ? (
                <ChildSettings infants={infants} user={currUser} />
              ) : null}
            </div>
          </Tab>
        ) : null}
        <Tab eventKey="register" title="Register Child">
          <Register additionalChild />
        </Tab>
      </Tabs>
    </div>
  );
}

export default Settings;

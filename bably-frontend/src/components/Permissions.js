import React from "react";
import Dropdown from "react-bootstrap/Dropdown";

function Permissions({
  infant,
  updateNotifications,
  updateAccess,
  removeAccess,
}) {
  const handleChangeNotif = async (userId, notifyAdmin, target) => {
    target.disabled = true;
    await updateNotifications(userId, infant.id, notifyAdmin);
    target.disabled = false;
  };

  const handleAccess = async (userId, crud, target, remove = false) => {
    if (remove) {
      await removeAccess(userId, infant.id);
    } else {
      target.disabled = true;
      await updateAccess(userId, infant.id, crud);
      target.disabled = false;
    }
  };

  const createRows = (users) => {
    return users.map((u) => (
      <tr key={u.userId} className="fw-bold mt-2">
        <td className="pt-3">{u.userName}</td>
        <td>
          <Dropdown>
            <Dropdown.Toggle variant="bablyBlue" id="dropdown-basic">
              {u.crud ? "Guardian" : "Babysitter"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                onClick={(e) => handleAccess(u.userId, true, e.target)}
              >
                Guardian
              </Dropdown.Item>
              <Dropdown.Item
                onClick={(e) => handleAccess(u.userId, false, e.target)}
              >
                Babysitter
              </Dropdown.Item>
              <Dropdown.Item
                onClick={(e) => handleAccess(u.userId, false, e.target, true)}
              >
                Remove
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </td>
        <td>
          <div className="col-6 form-check form-switch mx-auto me-sm-4">
            <input
              className="form-check-input lgSwitch"
              type="checkbox"
              role="switch"
              name="enabled"
              checked={u.notifyAdmin}
              onChange={(e) =>
                handleChangeNotif(u.userId, u.notifyAdmin, e.target)
              }
            />
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <div className="text-center">
      <hr />
      <p className="my-2 fw-bold">Change access to {infant.firstName}</p>
      <small>
        Enable notifications to get notified when a user logs new data
      </small>
      <table className="table table-striped bg-light mt-2">
        <thead>
          <tr className="small">
            <th className="wThird" scope="col">
              Name
            </th>
            <th className="wThird" scope="col">
              Role
            </th>
            <th className="wThird" scope="col">
              Notfications
            </th>
          </tr>
        </thead>
        <tbody>{createRows(infant.users)}</tbody>
      </table>
    </div>
  );
}

export default Permissions;

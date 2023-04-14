import React from "react";
import Dropdown from "react-bootstrap/Dropdown";

function Permissions({ infant }) {
  const createRows = (users) => {
    return users.map((u) => (
      <tr key={u.userId} className="fw-bold mt-2">
        <td className="pt-3">{u.userName}</td>
        <td>
          <Dropdown>
            <Dropdown.Toggle variant="bablyBlue" id="dropdown-basic">
              {u.crud ? "Caregiver" : "Babysitter"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => console.log("hai")}>
                Guardian
              </Dropdown.Item>
              <Dropdown.Item onClick={() => console.log("hai")}>
                Babysitter
              </Dropdown.Item>
              <Dropdown.Item onClick={() => console.log("hai")}>
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
              // checked={enabled}
              // onChange={handleSwitch}
            />
          </div>
        </td>
      </tr>
    ));
  };

  return (
    <div className="text-center">
      <hr />
      <p className="my-2 fw-bold">Change permissions for {infant.firstName}</p>
      <table className="table table-striped bg-light">
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
      {/* <button className="btn btn-bablyGreen form-control mt-4">
          Save Permissions
        </button> */}
    </div>
  );
}

export default Permissions;

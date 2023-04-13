import React from "react";
import Dropdown from "react-bootstrap/Dropdown";

function Permissions({ infant }) {
  const createRows = (users) => {
    return users.map((u) => (
      <tr key={u.userId} className="">
        <td>{u.userName}</td>
        <td>
        <Dropdown>
                <Dropdown.Toggle variant="bablyBlue" id="dropdown-basic">
                  Role
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
        <div className="col-6 form-check form-switch">
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
            <th scope="col">Name</th>
            <th scope="col">Role</th>
            <th scope="col">Notfications</th>
          </tr>
        </thead>
        <tbody>{createRows(infant.users)}</tbody>
      </table>
      {/* {infant.users.map((u) => (
        <p key={u.userId} className="text-start my-3">
          {u.userName}
          <button className="btn btn-bablyRed ms-4">
            <i className="bi bi-person-x">Remove</i>
          </button>
        </p>
      ))} */}
      {/* <button className="btn btn-bablyGreen form-control mt-4">
          Save Permissions
        </button> */}
    </div>
  );
}

export default Permissions;

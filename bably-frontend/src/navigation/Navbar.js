import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import UserContext from "../users/UserContext";
import NavDropdown from "react-bootstrap/NavDropdown";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

function Navigation({ logout }) {
  let { currUser, setChildId, currChild } = useContext(UserContext);

  const loggedIn = (
    <>
      {currChild ? (
        <>
          <Nav.Link to="/calendar" eventKey={1} as={NavLink} className="ms-2 ms-md-0">
            Calendar
          </Nav.Link>
          <Nav.Link to="/settings" eventKey={2} as={NavLink} className="ms-2 ms-md-0">
            Settings
          </Nav.Link>
          <Nav.Link to="/profile" eventKey={3} as={NavLink} className="ms-2 ms-md-0">
            {currChild.firstName}
          </Nav.Link>
        </>
      ) : null}

      {currUser && currUser.infants.length > 1 ? (
        <li className="nav-item dropdown">
          <NavDropdown id="nav-dropdown-dark-example" title="Change Profile" className="ms-2 ms-md-0">
            {currUser.infants.map((c, i) => (
              <NavDropdown.Item
                key={c.id}
                eventKey={i * 6}
                onClick={() => setChildId(c.id)}
              >
                {c.firstName}
              </NavDropdown.Item>
            ))}
          </NavDropdown>
        </li>
      ) : null}
    </>
  );

  return (
    <Navbar collapseOnSelect expand="md" variant="dark">
      <Nav.Link to="/" eventKey={6} as={Link} className="navbar-brand ms-2">
        Bably
      </Nav.Link>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto" activeKey="/">
          {currUser ? loggedIn : null}
        </Nav>
        <Nav>
          {currUser ? (
            <Nav.Link
              to="/"
              onClick={logout}
              eventKey={6}
              as={NavLink}
              className="me-4 ms-2 ms-md-0"
            >
              Logout
            </Nav.Link>
          ) : null}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Navigation;

import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import UserContext from "../users/UserContext";
import NavDropdown from "react-bootstrap/NavDropdown";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

function Navigation({ logout }) {
  let { currUser, setChildId, currChild } = useContext(UserContext);

  const loggedOut = (
    <>
      <Nav.Link to="/login" eventKey={4} as={NavLink}>
        Login
      </Nav.Link>
      <Nav.Link to="/signup" eventKey={5} as={NavLink}>
        Sign up
      </Nav.Link>
    </>
  );

  const loggedIn = (
    <>
      {currChild ? (
        <>
          <Nav.Link to="/calendar" eventKey={1} as={NavLink}>
            Calendar
          </Nav.Link>
          <Nav.Link to="/settings" eventKey={2} as={NavLink}>
            Settings
          </Nav.Link>
          <Nav.Link to="/profile" eventKey={3} as={NavLink}>
            {currChild.firstName}
          </Nav.Link>
        </>
      ) : null}

      {currUser && currUser.infants.length > 1 ? (
        <li className="nav-item dropdown">
          <NavDropdown id="nav-dropdown-dark-example" title="Change Profile">
            {currUser.infants.map((c, i) => (
              <NavDropdown.Item key={c.id} eventKey={i * 6} onClick={() => setChildId(c.id)}>
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
        <Nav className="me-auto"
              activeKey="/"
        >{currUser ? loggedIn : loggedOut}</Nav>
        <Nav>
          {currUser ? (
            <Nav.Link
              to="/"
              onClick={logout}
              eventKey={6}
              as={NavLink}
              className="me-4"
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

import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
import UserContext from "../users/UserContext";
import NavDropdown from "react-bootstrap/NavDropdown";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

function Navigation({ logout }) {
  let { currUser, setChildId, currChild } = useContext(UserContext);
  let location = useLocation();
  console.log(location.pathname);

  const loggedOut = (
    <>
      <Nav.Link href="/login">Login</Nav.Link>
      <Nav.Link href="/signup">Sign up</Nav.Link>
    </>
  );

  const loggedIn = (
    <>
      <Nav.Link href="/calendar">Calendar</Nav.Link>
      <Nav.Link href="/reminders">Reminders</Nav.Link>
      <Nav.Link href="/profile">
        {currChild ? currChild.firstName : ""}
      </Nav.Link>

      <li className="nav-item dropdown">
        {currUser && currUser.infants.length > 1 ? (
          <NavDropdown id="nav-dropdown-dark-example" title="Change Profile">
            {currUser.infants.map((c) => (
              <NavDropdown.Item key={c.id} onClick={() => setChildId(c.id)}>
                {c.firstName}
              </NavDropdown.Item>
            ))}
          </NavDropdown>
        ) : null}
      </li>
    </>
  );

  return (
    <Navbar collapseOnSelect expand="md" variant="dark">
      <Navbar.Brand href="/">Bably</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto" activeKey={location.pathname}>
          {currUser ? loggedIn : loggedOut}
        </Nav>
        <Nav>
          {currUser ? (
            <li className="nav-item nav-link" onClick={logout}>
              Logout
            </li>
          ) : null}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Navigation;

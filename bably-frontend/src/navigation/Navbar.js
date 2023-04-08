import React, { useContext } from "react";
import { useLocation, Link } from "react-router-dom";
import UserContext from "../users/UserContext";
import NavDropdown from "react-bootstrap/NavDropdown";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

function Navigation({ logout }) {
  let { currUser, setChildId, currChild } = useContext(UserContext);
  let location = useLocation();

  const loggedOut = (
    <>
      <Nav.Link href="/login">Login</Nav.Link>
      <Nav.Link href="/signup">Sign up</Nav.Link>
    </>
  );

  const loggedIn = (
    <>
      {currChild ? (
        <>
          <Nav.Link href="/calendar">Calendar</Nav.Link>
          <Nav.Link href="/settings">Settings</Nav.Link>
          <Nav.Link href="/profile">{currChild.firstName}</Nav.Link>
        </>
      ) : (
        <Nav.Link href="/register">Register</Nav.Link>
      )}

      {currUser && currUser.infants.length > 1 ? (
        <li className="nav-item dropdown">
          <NavDropdown id="nav-dropdown-dark-example" title="Change Profile">
            {currUser.infants.map((c) => (
              <NavDropdown.Item key={c.id} onClick={() => setChildId(c.id)}>
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
      <Navbar.Brand href="/">Bably</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto" activeKey={location.pathname}>
          {currUser ? loggedIn : loggedOut}
        </Nav>
        <Nav>
          {currUser ? (
            <Link to="/" onClick={logout} className="nav-link me-4">
              Logout
            </Link>
          ) : null}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Navigation;

import React, { useContext } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import UserContext from "../users/UserContext";

function Navbar({ logout }) {
  let { currUser } = useContext(UserContext);
  const navigate = useNavigate();

  let activeClassName = "nav-link active fw-bold";

  const loggedOut = (
    <>
      <li className="nav-item">
        <NavLink
          to="/login"
          data-bs-toggle="collapse"
          data-bs-target="#navbar"
          className={({ isActive }) =>
            isActive ? activeClassName : "nav-link"
          }
          onClick={() => navigate("/login")}
        >
          Login
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink
          to="/signup"
          data-bs-toggle="collapse"
          data-bs-target="#navbar"
          className={({ isActive }) =>
            isActive ? activeClassName : "nav-link"
          }
          onClick={() => navigate("/signup")}
        >
          Sign up
        </NavLink>
      </li>
    </>
  );

  const loggedIn = (
    <>
      <li className="nav-item">
        <NavLink
          to="/companies"
          data-bs-toggle="collapse"
          data-bs-target="#navbar"
          className={({ isActive }) =>
            isActive ? activeClassName : "nav-link"
          }
          onClick={() => navigate("/companies")}
        >
          Companies
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink
          to="/jobs"
          data-bs-toggle="collapse"
          data-bs-target="#navbar"
          className={({ isActive }) =>
            isActive ? activeClassName : "nav-link"
          }
          onClick={() => navigate("/jobs")}
        >
          Jobs
        </NavLink>
      </li>
      <li className="nav-item">
        <NavLink
          to="/profile"
          data-bs-toggle="collapse"
          data-bs-target="#navbar"
          className={({ isActive }) =>
            isActive ? activeClassName : "nav-link"
          }
          onClick={() => navigate("/profile")}
        >
          Profile
        </NavLink>
      </li>
      <li className="nav-item">
        <Link
          className="nav-link"
          data-bs-toggle="collapse"
          data-bs-target="#navbar"
          onClick={logout}
        >
          Log out
        </Link>
      </li>
    </>
  );

  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
        {/* fixed-bottom */}
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">
          Bably
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbar"
          aria-controls="navbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 text-start">
            {currUser ? loggedIn : loggedOut}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

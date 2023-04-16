import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import HomeAnon from "../components/HomeAnon";
import Home from "../components/Home";
import PrivateRoutes from "./PrivateRoutes";
import PublicRoutes from "./PublicRoutes";
import Register from "../users/Register";
import Calendar from "../components/Calendar";
import UserContext from "../users/UserContext";
import Profile from "../components/Profile";
import ResetPwd from "../users/ResetPwd";
import Settings from "../components/Settings";

function NavRoutes({ login, signup }) {
  const { currUser, currChild } = useContext(UserContext);

  return (
    <Routes>
      <Route
        exact
        path="/"
        element={
          currUser && currChild ? (
            <Home />
          ) : currUser && !currChild ? (
            <div className="col-11 col-sm-8 col-md-6 col-lg-5 col-xl-4 my-auto">
              <h2 className="text-center text-light">
                Welcome {currUser.firstName}!
              </h2>
              <p className="text-center text-light">
                <span>
                  if you're using Bably with an existing child account
                </span>
                <br />
                <span>
                  contact the primary user and request access.
                </span>
                <br />
                <span>
                  Otherwise, please fill out the form below.
                </span>
              </p>
              <Register />
            </div>
          ) : (
            <HomeAnon login={login} signup={signup} />
          )
        }
      />
      <Route element={<PublicRoutes />}>
        <Route exact path="/reset" element={<ResetPwd />} />
      </Route>
      <Route element={<PrivateRoutes />}>
        <Route exact path="/calendar" element={<Calendar />} />
        <Route exact path="/profile" element={<Profile />} />
        <Route exact path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default NavRoutes;

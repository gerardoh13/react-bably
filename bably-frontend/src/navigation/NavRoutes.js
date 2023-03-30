import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import HomeAnon from "../common/HomeAnon";
import Home from "../common/Home";
import Login from "../users/Login";
import Signup from "../users/Signup";
import PrivateRoutes from "./PrivateRoutes";
import PublicRoutes from "./PublicRoutes";
import Register from "../users/Register";
import Calendar from "../components/Calendar";
import UserContext from "../users/UserContext";
import Profile from "../components/Profile";

function NavRoutes({ login, signup }) {
  const { currUser, currChild } = useContext(UserContext);

  return (
    <Routes>
      <Route exact path="/" element={currUser && currChild ? <Home /> : <HomeAnon />} />
      <Route element={<PublicRoutes />}>
        <Route exact path="/login" element={<Login login={login} />} />
        <Route exact path="/signup" element={<Signup signup={signup} />} />
      </Route>
      <Route element={<PrivateRoutes />}>
        <Route exact path="/calendar" element={<Calendar />} />
        <Route exact path="/profile" element={<Profile />} />
      </Route>
      <Route exact path="/register" element={<Register />} />
    </Routes>
  );
}

export default NavRoutes;

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
import ResetPwd from "../users/ResetPwd";
import Settings from "../components/Settings";

function NavRoutes({ login, signup }) {
  const { currUser, currChild } = useContext(UserContext);

  return (
    <Routes>
      <Route exact path="/" element={currUser && currChild ? <Home /> : <HomeAnon />} />
      <Route element={<PublicRoutes />}>
        <Route exact path="/login" element={<Login login={login} />} />
        <Route exact path="/signup" element={<Signup signup={signup} />} />
        <Route exact path="/reset" element={<ResetPwd />} />
      </Route>
      <Route element={<PrivateRoutes />}>
        <Route exact path="/calendar" element={<Calendar />} />
        <Route exact path="/profile" element={<Profile />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default NavRoutes;

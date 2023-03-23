import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../common/Home";
import Login from "../users/Login";
import Signup from "../users/Signup";
import PrivateRoutes from "./PrivateRoutes";
import PublicRoutes from "./PublicRoutes";
import Register from "../users/Register";
import Calendar from "../components/Calendar";
import Feeds from "../components/Feeds";
function NavRoutes({ login, signup }) {
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route element={<PublicRoutes />}>
        <Route exact path="/login" element={<Login login={login} />} />
        <Route exact path="/signup" element={<Signup signup={signup} />} />
      </Route>
      <Route element={<PrivateRoutes />}>
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/calendar" element={<Calendar />} />
        <Route exact path="/feeds" element={<Feeds />} />
      </Route>
    </Routes>
  );
}

export default NavRoutes;

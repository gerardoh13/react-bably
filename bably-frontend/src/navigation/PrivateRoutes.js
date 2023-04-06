import React, { useContext } from "react";
import UserContext from "../users/UserContext";
import { Outlet, Navigate } from "react-router-dom";

function PrivateRoute() {
  const { currUser, currChild } = useContext(UserContext);

  if (!currUser) {
    console.log("NAVIGATE TO LOGIN")
    return <Navigate to="/login" replace />;
  } else if (currUser && !currChild) {
    return <Navigate to="/register" replace />;
  }
  return <Outlet />;
}

export default PrivateRoute;

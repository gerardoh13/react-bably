import React, { useContext } from "react";
import UserContext from "../users/UserContext";
import { Outlet, Navigate } from "react-router-dom";

function PrivateRoute() {
  const { currUser } = useContext(UserContext);

  if (!currUser) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

export default PrivateRoute;

import React, { useContext } from "react";
import UserContext from "../users/UserContext";
import { Outlet, Navigate } from "react-router-dom";

function PublicRoutes() {
  const { currUser } = useContext(UserContext);

  if (currUser) {
    console.log("NAVIGATE TO HOME")
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

export default PublicRoutes;

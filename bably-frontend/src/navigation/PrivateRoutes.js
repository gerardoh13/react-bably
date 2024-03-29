import React, { useContext } from "react";
import UserContext from "../users/UserContext";
import { Outlet, Navigate } from "react-router-dom";

function PrivateRoutes() {
  const { currUser, currChild } = useContext(UserContext);

  if (!currUser || !currChild) {
    return <Navigate to="/" replace />;
  } else return <Outlet />;
}

export default PrivateRoutes;

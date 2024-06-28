import React from "react";
import { useUserContext } from "../context/userContext";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { user } = useUserContext();
  if (!user) return <Navigate to="/signin" replace />;
  return children;
};

export default PrivateRoute;

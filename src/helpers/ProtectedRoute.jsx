import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../utils/isAuthenticated";

const ProtectedRoute = ({ children }) => {
    

  return isAuthenticated() ? children : <Navigate to='/login' />;
};

export default ProtectedRoute;

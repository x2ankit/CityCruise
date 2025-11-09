import React, { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";

const UserProtectWrapper = ({ children }) => {
  const { user, setUser } = useContext(UserDataContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("userData");

    if (token && storedUser && !user) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" />;

  return children;
};

export default UserProtectWrapper;

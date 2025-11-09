import { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { CaptainDataContext } from "../context/CapatainContext";

const CaptainProtectWrapper = ({ children }) => {
  const { captain, setCaptain } = useContext(CaptainDataContext);

  useEffect(() => {
    const token = localStorage.getItem("captain_token");
    const data = localStorage.getItem("captainData");

    if (token && data && !captain) {
      setCaptain(JSON.parse(data));
    }
  }, []);

  const token = localStorage.getItem("captain_token");
  if (!token) return <Navigate to="/captain-login" />;

  return children;
};

export default CaptainProtectWrapper;

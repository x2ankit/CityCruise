/* eslint-disable no-unused-vars */
import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CaptainDataContext } from "../context/CapatainContext";
import loginlogo from "../assets/CityCruise__3_-removebg-preview.png";

const Captainlogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setCaptain } = useContext(CaptainDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captains/login`,
        { email, password },
        { withCredentials: true }
      );

      toast.success("Login successful");

      setCaptain(res.data.captain);
      localStorage.setItem("captain_token", res.data.token);
      localStorage.setItem("captainData", JSON.stringify(res.data.captain));

      setTimeout(() => navigate("/captain-home"), 500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <ToastContainer />
      <form className="p-8 bg-white shadow rounded w-96" onSubmit={submitHandler}>
        <img src={loginlogo} className="w-40 mx-auto mb-6" />
        <input
          className="border p-2 w-full mb-3"
          type="email"
          placeholder="Captain Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="border p-2 w-full mb-5"
          type="password"
          placeholder="Captain Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="bg-green-600 text-white w-full p-2 rounded hover:bg-green-700">
          Sign in as Captain
        </button>

        <p className="text-center mt-3 text-sm">
          New Captain? <Link to="/captain-signup">Register here</Link>
        </p>
      </form>
    </div>
  );
};

export default Captainlogin;

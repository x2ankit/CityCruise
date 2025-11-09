/* eslint-disable no-unused-vars */
import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import loginlogo from "../assets/CityCruise__3_-removebg-preview.png";
import { UserDataContext } from "../context/UserContext";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/login`,
        { email, password },
        { withCredentials: true }
      );

      toast.success("Login successful!");

      setUser(res.data.user);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userData", JSON.stringify(res.data.user));

      setTimeout(() => navigate("/home"), 500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <ToastContainer />
      <form onSubmit={submitHandler} className="p-8 bg-white shadow rounded w-96">
        <img src={loginlogo} className="w-40 mx-auto mb-6" />
        <input type="email" placeholder="Email" className="border p-2 w-full mb-3" value={email} onChange={(e)=>setEmail(e.target.value)} required/>
        <input type="password" placeholder="Password" className="border p-2 w-full mb-5" value={password} onChange={(e)=>setPassword(e.target.value)} required/>
        <button className="bg-black text-white w-full p-2 rounded">Sign in</button>
        <p className="text-center mt-3 text-sm">New user? <Link to="/signup">Create account</Link></p>
      </form>
    </div>
  );
};

export default UserLogin;

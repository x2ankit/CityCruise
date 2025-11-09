/* eslint-disable no-unused-vars */
import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import loginlogo from "../assets/CityCruise__3_-removebg-preview.png";
import { UserDataContext } from "../context/UserContext";
import { googleSignIn, login as apiLogin } from "../services/auth";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await apiLogin(email, password);

      toast.success("Login successful!");

      setUser(res.user);
      localStorage.setItem("token", res.token);
      localStorage.setItem("userData", JSON.stringify(res.user));

      setTimeout(() => navigate("/home"), 500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  // Google Identity Services
  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) return; // no client id, skip

    const scriptId = 'google-identity-script';
    if (document.getElementById(scriptId)) return;

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.id = scriptId;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      /* global google */
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response) => {
            try {
              const idToken = response.credential;
              const data = await googleSignIn(idToken, 'user');
              toast.success('Logged in with Google');
              setUser(data.user);
              localStorage.setItem('token', data.token);
              localStorage.setItem('userData', JSON.stringify(data.user));
              setTimeout(() => navigate('/home'), 500);
            } catch (err) {
              toast.error(err.response?.data?.message || 'Google login failed');
            }
          }
        });

        window.google.accounts.id.renderButton(
          document.getElementById('googleSignInDiv'),
          { theme: 'outline', size: 'large' }
        );
      } catch (e) {
        console.error('Google identity init error', e);
      }
    };
    document.body.appendChild(script);
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <ToastContainer />
      <form onSubmit={submitHandler} className="p-8 bg-white shadow-lg rounded w-96 transform transition duration-300 hover:scale-102">
        <img src={loginlogo} className="w-40 mx-auto mb-6" />
        <input type="email" placeholder="Email" className="border p-2 w-full mb-3 rounded" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" className="border p-2 w-full mb-4 rounded" value={password} onChange={(e)=>setPassword(e.target.value)} required />
        <button className="bg-black text-white w-full p-2 rounded mb-3 transition-colors duration-200 hover:bg-gray-800">Sign in</button>

        <div className="flex items-center my-3">
          <div className="flex-grow h-px bg-gray-300" />
          <div className="px-3 text-sm text-gray-500">or</div>
          <div className="flex-grow h-px bg-gray-300" />
        </div>

        <div id="googleSignInDiv" className="flex justify-center mb-3"></div>

        <p className="text-center mt-3 text-sm">New user? <Link to="/signup">Create account</Link></p>
      </form>
    </div>
  );
};

export default UserLogin;

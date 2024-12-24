import React, { useState } from "react";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Handle Google Login
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      const firebaseUid = result.user.uid;
      const email = result.user.email;
      localStorage.setItem("token", token);

      await axios.post(
        "http://localhost:5000/api/profile",
        { firebaseUid, email, profileComplete: false },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Check profile status
      const response = await axios.get("http://localhost:5000/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.profileComplete) {
        navigate("/profile");
      } else {
        navigate("/add-profile");
      }
    } catch (error) {
      console.error("Error logging in with Google:", error.message);
    }
  };

  // Handle Email/Password Login
  const handleEmailLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      localStorage.setItem("token", token);

      // Check profile status
      const response = await axios.get("http://localhost:5000/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.profileComplete) {
        navigate("/profile");
      } else {
        navigate("/add-profile");
      }
    } catch (error) {
      console.error("Error logging in with email:", error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

        {/* Google Login Section */}
        <div className="mb-6 text-center">
          <button
            onClick={handleGoogleLogin}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login with Google
          </button>
        </div>

        {/* Email Login Section */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Or Login with Email</h3>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleEmailLogin}
            className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Login with Email
          </button>
        </div>

        {/* Signup Link */}
        <div className="text-center">
          <Link to="/signup" className="text-sm text-blue-600 hover:underline">
            Don't have an account? Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

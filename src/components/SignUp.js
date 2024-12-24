import React, { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    // Password match validation
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      // Firebase Signup
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken(); // Get Firebase token
      const firebaseUid = userCredential.user.uid; // Get Firebase UID

      // Send user data to the backend
      await axios.post(
        "http://localhost:5000/api/profile",
        { firebaseUid, email, profileComplete: false },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // On success, redirect to profile setup or login page
      console.log("User signed up successfully:", userCredential.user);
      alert("Account created successfully!");
      navigate("/"); // Navigate to login page after signup
    } catch (err) {
      // Handle Firebase errors
      console.error("Error during signup:", err.message);
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Sign Up</h2>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Sign Up
          </button>
        </form>
        <div className="text-center mt-5">
          <Link to="/" className="text-sm text-blue-600 hover:underline">
            Already have an account? Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

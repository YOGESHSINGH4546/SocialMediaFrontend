import React, { useState, useEffect } from "react";
import axios from "axios";
import LogoutButton from "./LogoutButton";
import { Link } from "react-router-dom";
import QRCodeGenerator from "./QRCodeGenerator"

const Profile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {

  }, [profile]);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
        const parallaxImage = document.getElementById("parallaxImage");
        if (parallaxImage) {
          parallaxImage.addEventListener("mousemove", (e) => {
            const rect = parallaxImage.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            const deltaX = (mouseX - centerX) / centerX;
            const deltaY = (mouseY - centerY) / centerY;
            const rotateX = deltaY * 1000;
            const rotateY = -deltaX * 1000;

            parallaxImage.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
          });

          parallaxImage.addEventListener("mouseleave", () => {
            parallaxImage.style.transform = "rotateX(0deg) rotateY(0deg)";
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error.message);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) {
    return <div className="flex items-center justify-center h-screen text-xl">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10">
      <div className="bg-white shadow-lg rounded-lg p-8 w-auto max-w-full text-center">
        <h2 className="text-2xl font-semibold mb-4">Welcome, {profile.name}</h2>

        {/* Display profile image */}
        {profile.profilePhoto ? (
          <img
            id="parallaxImage"
            className="rounded-full w-32 h-32 mx-auto object-cover shadow-md hover:shadow-lg transition-transform duration-300"
            src={`http://localhost:5000/${profile.profilePhoto}`}
            alt="Profile"
          />
        ) : (
          <p className="text-gray-500">No profile photo available</p>
        )}

        <div className="mt-6">
          <p className="text-gray-600">
            <span className="font-semibold">Name:</span> {profile.name}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Phone:</span> {profile.phone}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Gender:</span> {profile.gender}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Address:</span> {profile.address}
          </p>
        </div>
        <div className="mt-5">
          <QRCodeGenerator url={'http://localhost:5000/profile/'+profile.email}/>
        </div>
        <div className="mt-6">
          <Link
            to="/add-profile"
            className="me-3 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Edit Profile
          </Link>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
};

export default Profile;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddProfile = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setName(response.data.name || "");
        setPhone(response.data.phone || "");
        setGender(response.data.gender || "");
        setAddress(response.data.address || "");
      } catch (error) {
        console.error("Error fetching profile:", error.message);
      }
    };

    fetchProfile();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = "Name is required.";
    if (!phone) newErrors.phone = "Phone number is required.";
    if (!/^\d{10}$/.test(phone)) newErrors.phone = "Phone number must be 10 digits.";
    if (!gender) newErrors.gender = "Gender is required.";
    if (!address) newErrors.address = "Address is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async () => {
    const token = localStorage.getItem("token");

    if (!validateForm()) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("phone", phone);
      formData.append("gender", gender);
      formData.append("address", address);
      if (profilePhoto) {
        formData.append("profilePhoto", profilePhoto); // Append the file
      }

      await axios.put(
        "http://localhost:5000/api/profile",
        formData,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
      );
      navigate("/profile");
    } catch (error) {
      console.error("Error updating profile:", error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6">Update Your Profile</h2>

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            id="name"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            id="phone"
            type="text"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && <p className="text-red-600 text-sm mt-1">{errors.gender}</p>}
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
          <input
            id="address"
            type="text"
            placeholder="Enter your address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
        </div>

        <div>
          <label htmlFor="profilePhoto" className="block text-sm font-medium text-gray-700">Profile Photo</label>
          <input
            id="profilePhoto"
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePhoto(e.target.files[0])}
            className="w-full mt-2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.profilePhoto && <p className="text-red-600 text-sm mt-1">{errors.profilePhoto}</p>}
        </div>

        <div>
          <button
            onClick={handleProfileSubmit}
            className="w-full p-3 mt-6 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProfile;

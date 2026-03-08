"use client"; // Ensure this component is client-side rendered

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import FormField from "../molecules/FormField";
import Button from "../atoms/Button";
import Texts from "../atoms/Texts";
import Loader from "../atoms/Loader";

const EditProfile = () => {
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    profileImage: "",
    travelCity: "",
    travelCountry: "",
  });

  const [travelCity, setTravelCity] = useState("");
  const [travelCountry, setTravelCountry] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      // Fetch user data from API
      const fetchUserData = async () => {
        try {
          const res = await fetch(`/api/users/${session.user.email}/update`);
          const data = await res.json();
          setFormData({
            name: data.name,
            bio: data.bio,
            travelCity: data.travelCity,
            travelCountry: data.travelCountry,
          });
          setTravelCity(data.travelCity);
          setTravelCountry(data.travelCountry);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      };

      fetchUserData();
    }
  }, [status, session]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    setFormData({
      ...formData,
      travelCity,
      travelCountry,
    });
  }, [travelCity, travelCountry]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/users/${session.user.email}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Profile updated successfully");
        router.push("/");
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  if (status === "loading") {
    return <Loader />;
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
          <p className="text-gray-500 text-sm mt-1">Update your travel profile information</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.08)] border border-gray-100 p-8">
          {/* Avatar placeholder */}
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
            <div className="w-16 h-16 bg-[#003580] rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {formData.name?.charAt(0).toUpperCase() || "?"}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{formData.name || "Your Name"}</p>
              <p className="text-sm text-gray-400">{session?.user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <FormField
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <FormField
              label="Bio"
              type="text"
              placeholder="Share a little about yourself..."
              name="bio"
              value={formData.bio}
              onChange={handleChange}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Travel City"
                type="text"
                name="travelCity"
                placeholder="City"
                value={travelCity}
                onChange={(e) => setTravelCity(e.target.value)}
              />
              <FormField
                label="Travel Country"
                type="text"
                name="travelCountry"
                placeholder="Country"
                value={travelCountry}
                onChange={(e) => setTravelCountry(e.target.value)}
              />
            </div>
            <div className="pt-2">
              <Button type="submit" name="login" className="w-full justify-center py-3">
                Save changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;

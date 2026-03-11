"use client";
import React, { useState, useEffect, useMemo } from "react";
import MainNavbar from "@/ui/organisms/MainNavbar";
import Provider from "@/context/Provider";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loader from "@/ui/atoms/Loader";
import Link from "next/link";

const TRAVEL_TYPES = [
  "Adventure",
  "Beach",
  "Cultural",
  "Business",
  "Family",
  "Solo",
  "Backpacking",
  "Luxury",
];

const TRAVEL_TYPE_ICONS = {
  Adventure: "🏔️",
  Beach: "🏖️",
  Cultural: "🏛️",
  Business: "💼",
  Family: "👨‍👩‍👧‍👦",
  Solo: "🎒",
  Backpacking: "🌿",
  Luxury: "✨",
};

const ProfilePageContent = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    profileImage: "",
    travelCity: "",
    travelCountry: "",
    travelType: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchUserData();
    }
  }, [session]);

  const fetchUserData = async () => {
    try {
      const res = await fetch(`/api/users/${session.user.email}/update`);
      if (res.ok) {
        const data = await res.json();
        setFormData({
          name: data.name || "",
          bio: data.bio || "",
          profileImage: data.profileImage || "",
          travelCity: data.travelCity || "",
          travelCountry: data.travelCountry || "",
          travelType: data.travelType || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/users/${session.user.email}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("Profile updated successfully! ✅");
        setIsEditing(false);
        fetchUserData();
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const colors = ["#003580", "#009fe3", "#00AF87", "#7c3aed", "#db2777", "#ea580c"];

  const avatarColor = useMemo(() => {
    if (!isMounted || !formData.name) return "#003580";
    return colors[(formData.name.length || 0) % colors.length];
  }, [formData.name, isMounted]);

  if (status === "loading" || loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavbar />

      {/* Header Banner */}
      <section
        className="relative h-44 bg-cover bg-center"
        style={{ background: "linear-gradient(135deg, #003580 0%, #009fe3 60%, #00AF87 100%)" }}
      >
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute -bottom-14 left-1/2 -translate-x-1/2">
          {formData.profileImage ? (
            <img
              src={formData.profileImage}
              alt={formData.name}
              className="w-28 h-28 ring-4 ring-white rounded-full object-cover bg-white shadow-lg"
            />
          ) : (
            <div
              className="w-28 h-28 ring-4 ring-white rounded-full flex items-center justify-center text-white font-bold text-5xl shadow-lg"
              style={{ backgroundColor: avatarColor }}
            >
              {formData.name?.charAt(0).toUpperCase() || "?"}
            </div>
          )}
        </div>
      </section>

      {/* Profile Content */}
      <section className="max-w-3xl mx-auto px-4 pt-20 pb-12">
        {!isEditing ? (
          <div>
            {/* Name & Edit Button */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{formData.name}</h1>
              <p className="text-gray-500 text-sm">{session?.user?.email}</p>
              <button
                onClick={() => setIsEditing(true)}
                className="mt-5 inline-flex items-center gap-2 px-6 py-2.5 bg-[#003580] text-white text-sm font-semibold rounded-lg hover:bg-[#002a6e] transition-colors shadow-sm"
              >
                ✏️ Edit Profile
              </button>
            </div>

            {/* Info Cards */}
            <div className="space-y-4">
              {/* Bio Card */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">About</h2>
                <p className="text-gray-700 leading-relaxed">
                  {formData.bio || "No bio added yet. Tell others about yourself!"}
                </p>
              </div>

              {/* Travel Info Card */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Travel Plans</h2>
                {formData.travelCity || formData.travelCountry || formData.travelType ? (
                  <div className="space-y-3">
                    {(formData.travelCity || formData.travelCountry) && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#009fe3]/10 rounded-full flex items-center justify-center text-xl">
                          📍
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {formData.travelCity}
                            {formData.travelCity && formData.travelCountry && ", "}
                            {formData.travelCountry}
                          </p>
                          <p className="text-xs text-gray-400">Destination</p>
                        </div>
                      </div>
                    )}
                    {formData.travelType && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#003580]/10 rounded-full flex items-center justify-center text-xl">
                          {TRAVEL_TYPE_ICONS[formData.travelType] || "✈️"}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{formData.travelType}</p>
                          <p className="text-xs text-gray-400">Travel style</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    No travel plans set. Add your destination to connect with others!
                  </p>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: "💬", value: formData.chats?.length || 0, label: "Chats" },
                  { icon: "🌍", value: 1, label: "Destinations" },
                  { icon: "👥", value: 0, label: "Friends" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-5 text-center shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
                    <div className="text-2xl mb-1">{stat.icon}</div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-400 font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <Link
                  href="/discover"
                  className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.1)] transition-shadow"
                >
                  <div className="w-10 h-10 bg-[#003580]/10 rounded-xl flex items-center justify-center text-lg">🔍</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">Find Companions</h3>
                    <p className="text-xs text-gray-400">Discover travelers</p>
                  </div>
                </Link>
                <Link
                  href="/chats"
                  className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.1)] transition-shadow"
                >
                  <div className="w-10 h-10 bg-[#009fe3]/10 rounded-xl flex items-center justify-center text-lg">💬</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">My Chats</h3>
                    <p className="text-xs text-gray-400">View conversations</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Edit Mode */
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
              <button
                type="button"
                onClick={() => { setIsEditing(false); fetchUserData(); }}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#003580] focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* Bio Field */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell others about yourself..."
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#003580] focus:border-transparent transition-all resize-none"
                />
              </div>

              {/* Travel Info */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Travel Plans</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">City / Place</label>
                    <input
                      type="text"
                      name="travelCity"
                      value={formData.travelCity}
                      onChange={handleChange}
                      placeholder="e.g., Tokyo"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#003580] focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Country</label>
                    <input
                      type="text"
                      name="travelCountry"
                      value={formData.travelCountry}
                      onChange={handleChange}
                      placeholder="e.g., Japan"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#003580] focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Travel Style</label>
                  <select
                    name="travelType"
                    value={formData.travelType}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#003580] focus:border-transparent transition-all bg-white"
                  >
                    <option value="">Select travel style...</option>
                    {TRAVEL_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {TRAVEL_TYPE_ICONS[t]} {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 bg-[#003580] text-white font-semibold rounded-lg hover:bg-[#002a6e] transition-colors disabled:opacity-50 shadow-sm"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        )}
      </section>
    </div>
  );
};

export default function NewProfilePage() {
  return (
    <Provider>
      <ProfilePageContent />
    </Provider>
  );
}

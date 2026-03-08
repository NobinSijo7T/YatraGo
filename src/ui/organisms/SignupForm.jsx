"use client";

import React, { useState, useEffect } from "react";
import FormField from "../molecules/FormField";
import Button from "../atoms/Button";
import Texts from "../atoms/Texts";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";

const SignupForm = () => {
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { name, email, password } = formData;
  const router = useRouter();

  // Redirect user if they are already logged in
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/"); // Redirect to homepage or any other page
    }
  }, [status, router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess("Registration successful! Logging you in...");
        
        // Auto-login after registration
        const loginRes = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (loginRes.ok) {
          setTimeout(() => router.push("/"), 1000);
        } else {
          setTimeout(() => router.push("/login"), 1500);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to register");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setError("Failed to register. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-lg overflow-hidden">
            <img src="/black_ver.png" alt="YathraGo" className="w-full h-full object-contain" />
          </div>
          <span className="text-xl font-bold text-[#003580]">YathraGo</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
        <p className="text-sm text-gray-500 mt-1">Join thousands of travelers worldwide</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-8 border border-gray-100">
        <form onSubmit={handleSubmit}>
          <FormField
            label="Full name"
            type="text"
            placeholder="John Doe"
            name="name"
            value={name}
            onChange={handleChange}
          />
          <FormField
            label="Email address"
            type="email"
            placeholder="you@example.com"
            name="email"
            value={email}
            onChange={handleChange}
          />
          <FormField
            label="Password"
            type="password"
            placeholder="Create a strong password"
            name="password"
            value={password}
            onChange={handleChange}
          />

          {error && (
            <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-4 p-3.5 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 text-sm">{success}</p>
            </div>
          )}

          <Button type="submit" name="register" className="w-full justify-center py-3 text-base mt-1">
            Create account
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#003580] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;

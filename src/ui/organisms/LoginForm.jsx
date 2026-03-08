// LoginForm.jsx
"use client";
import React, { useState, useEffect } from "react";
import FormField from "../molecules/FormField";
import Button from "../atoms/Button";
import Texts from "../atoms/Texts";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { data: session, status } = useSession();

  // Redirect user if they are already logged in
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/"); // Redirect to homepage or any other page
    }
  }, [status, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    console.log("SignIn Response:", res); // Log the response for debugging

    if (res.ok) {
      router.push("/");
    } else {
      const errorMsg = res.error || "Failed to login";
      setError(errorMsg);
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
        <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
        <p className="text-sm text-gray-500 mt-1">Sign in to continue your journey</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-8 border border-gray-100">
        <form onSubmit={handleSubmit}>
          <FormField
            label="Email address"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormField
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <Button type="submit" name="login" className="w-full justify-center py-3 text-base mt-1">
            Sign in
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-[#003580] hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;

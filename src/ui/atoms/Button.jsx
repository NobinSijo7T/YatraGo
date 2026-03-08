"use client";
import React from "react";
import { signOut } from "next-auth/react";

const Button = ({ children, onClick, name, type = "button", className = "", disabled }) => {
  const base =
    "inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  let variant = "";

  switch (name) {
    case "login":
      variant = "bg-[#003580] text-white hover:bg-[#00266b] focus:ring-[#003580]";
      break;
    case "logout":
      variant = "bg-white text-[#cc0000] border border-[#e5e7eb] hover:bg-red-50 focus:ring-red-300";
      onClick = onClick || (() => signOut({ callbackUrl: "/" }));
      break;
    case "register":
      variant = "bg-[#009fe3] text-white hover:bg-[#007ec0] focus:ring-[#009fe3]";
      break;
    default:
      variant = "bg-[#003580] text-white hover:bg-[#00266b] focus:ring-[#003580]";
  }

  return (
    <button
      type={type}
      className={`${base} ${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;

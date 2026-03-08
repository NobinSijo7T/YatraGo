import React from "react";

const Input = ({ type, placeholder, value, onChange, onKeyDown, name, required }) => {
  const base = "w-full text-gray-900 text-sm placeholder-gray-400 bg-white border border-gray-300 rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#003580] focus:border-transparent";

  let typeClass = "";

  switch (type) {
    case "text":
    case "email":
    case "password":
      typeClass = "px-4 py-3";
      break;
    case "search":
      typeClass = "px-4 pr-10 py-2.5";
      break;
    case "message":
      typeClass = "flex-grow px-4 py-2.5";
      break;
    default:
      typeClass = "px-4 py-2.5";
  }

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      name={name}
      required={required}
      className={`${base} ${typeClass}`}
    />
  );
};

export default Input;

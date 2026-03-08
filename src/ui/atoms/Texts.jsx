import React from "react";

const Texts = ({ type, children, className = "" }) => {
  let typeClass = "";

  switch (type) {
    case "heading":
      typeClass = "text-3xl font-bold text-gray-900 tracking-tight";
      break;
    case "subheading":
      typeClass = "text-xl font-semibold text-gray-800";
      break;
    case "label":
      typeClass = "block text-sm font-medium text-gray-700 mb-1";
      break;
    case "error":
      typeClass = "text-red-500 text-sm";
      break;
    case "success":
      typeClass = "text-green-600 text-sm";
      break;
    case "info":
      typeClass = "text-sm text-gray-500";
      break;
    default:
      typeClass = "text-sm text-gray-600";
  }

  return <p className={`${typeClass} ${className}`}>{children}</p>;
};

export default Texts;

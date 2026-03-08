import React from "react";
import Input from "../atoms/Input";
import Texts from "../atoms/Texts";

const FormField = ({ label, type, placeholder, name, value, onChange, required = true }) => (
  <div className="mb-5 w-full">
    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
    <Input
      type={type}
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
    />
  </div>
);

export default FormField;

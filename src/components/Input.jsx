import React from "react";

const Input = ({ type, placeholder, value, name, errors, onChange }) => {
  const inputClasses = `w-full rounded-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-royal-purple text-sm`;
  const inputClassesErrors = "ring-red-400";

  return (
    <>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        name={name}
        onChange={onChange}
        className={`${inputClasses} ${errors[name] && inputClassesErrors}`}
      />
      {errors[name] && (
        <span className="text-xs text-red-400">{errors[name]}</span>
      )}
    </>
  );
};

export default Input;

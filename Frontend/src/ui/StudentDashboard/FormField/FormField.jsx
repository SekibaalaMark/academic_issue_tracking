import React from "react";
import "./FormField.css";

const FormField = ({
  label,
  type,
  value,
  onChange,
  placeholder,
  required,
  options,
}) => {
  return (
    <div className="form-field">
      <label>{label}</label>
      {type === "select" ? (
        <select value={value} onChange={onChange} required={required}>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : type === "file" ? (
        <input type="file" onChange={onChange} required={required} />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
        />
      )}
    </div>
  );
};

export default FormField;

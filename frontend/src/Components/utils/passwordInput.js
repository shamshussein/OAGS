import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const PasswordInput = ({
  value,
  onChange,
  showPassword,
  togglePasswordVisibility,
  placeholder = "Password",
}) => {
  return (
    <div style={{ position: "relative" }}>
      <input
        type={showPassword ? "text" : "password"}
        className="form-control"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        style={{ paddingRight: "40px" }} 
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="btn btn-outline-secondary password-toggle-button"
        style={{
          position: "absolute",
          right: "0",
          top: "50%",
          transform: "translateY(-50%)",
          border: "none",
          background: "transparent",
          cursor: "pointer",
        }}
      >
        <FontAwesomeIcon
          icon={showPassword ? faEyeSlash : faEye}
          style={{
            color: "darkgrey",
            transition: "color 0.2s ease", 
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "grey")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "darkgrey")} 
        />
      </button>
    </div>
  );
};

export default PasswordInput;
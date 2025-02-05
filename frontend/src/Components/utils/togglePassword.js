import { useState } from "react";

const useTogglePassword = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return { showPassword, togglePasswordVisibility };
};

export default useTogglePassword;

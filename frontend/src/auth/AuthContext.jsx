import { useState } from "react";
import { AuthContext } from "./authStore";

const decodeToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      token,
      role: payload.role,
      email: payload.email
    };
  } catch {
    return null;
  }
};

const getStoredUser = () => {
  const token = localStorage.getItem("access_token");

  if (!token) return null;

  return decodeToken(token);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);
  const [loading] = useState(false);

  const login = (data) => {
    setUser(decodeToken(data.access_token));
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

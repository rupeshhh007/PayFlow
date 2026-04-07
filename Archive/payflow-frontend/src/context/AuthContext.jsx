import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const decodeToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    return {
      email:
        payload.sub ||
        payload.email ||
        payload.username ||
        null,
    };
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load auth on refresh
  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      const decoded = decodeToken(storedToken);

      if (decoded) {
        setUser(decoded);
        setToken(storedToken);
      }
    }

    setLoading(false);
  }, []);

  // ✅ LOGIN
  const login = (jwtToken) => {
    localStorage.setItem("token", jwtToken);

    const decoded = decodeToken(jwtToken);

    setToken(jwtToken);
    setUser(decoded);

    navigate("/dashboard");
  };

  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem("token");

    setUser(null);
    setToken(null);

    navigate("/login", { replace: true });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Hook
export const useAuth = () => useContext(AuthContext);
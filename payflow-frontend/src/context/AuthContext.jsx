import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import { useNavigate } from "react-router-dom";
import API from "../api/api";
import toast from "react-hot-toast";

const AuthContext = createContext();

// ---------------- SAFE TOKEN DECODE ----------------
const decodeToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    // check expiry
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return null;
    }

    return {
      email:
        payload.sub ||
        payload.email ||
        payload.username ||
        null,
      exp: payload.exp,
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

  // ---------------- INIT AUTH ----------------
  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      const decoded = decodeToken(storedToken);

      if (decoded) {
        setUser(decoded);
        setToken(storedToken);

        // attach token to axios
        API.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${storedToken}`;
      } else {
        localStorage.removeItem("token");
      }
    }

    setLoading(false);
  }, []);

  // ---------------- LOGIN ----------------
  const login = (jwtToken) => {
    const decoded = decodeToken(jwtToken);

    if (!decoded) {
      logout();
      return;
    }

    localStorage.setItem("token", jwtToken);

    setToken(jwtToken);
    setUser(decoded);

    // attach token globally
    API.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${jwtToken}`;
  };

  // ---------------- LOGOUT ----------------
 const logout = useCallback(() => {
  localStorage.removeItem("token");

  setUser(null);
  setToken(null);

  delete API.defaults.headers.common["Authorization"];

  navigate("/login", { replace: true });
}, [navigate]);

  // ---------------- AUTO LOGOUT ON EXPIRY ----------------
  useEffect(() => {
    if (!user?.exp) return;

    const timeout = user.exp * 1000 - Date.now();

    if (timeout <= 0) {
      logout();
      return;
    }

    const timer = setTimeout(() => {
      toast.error("Session expired. Please login again.");
      logout();
    }, timeout);

    return () => clearTimeout(timer);
  }, [user , logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ---------------- HOOK ----------------
export const useAuth = () => useContext(AuthContext);
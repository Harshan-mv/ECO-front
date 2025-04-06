import { createContext, useReducer, useEffect } from "react";
import api from "../utils/api";  // ✅ Import the configured Axios instance

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      
      return { ...state, isAuthenticated: true, user: action.payload };
    case "LOGOUT":
      localStorage.removeItem("user");
      return { ...state, isAuthenticated: false, user: null };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    isAuthenticated: false,
    user: null,
  });

  // Auto-login (check session)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      dispatch({ type: "LOGIN", payload: JSON.parse(storedUser) });
    }

    // ✅ Set Axios Interceptor once
    api.interceptors.request.use((config) => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
      return config;
    });
  }, []);

  // 🔥 Login Function
  const login = async (emailOrUser, password, navigate) => {
    try {
      if (typeof emailOrUser === "object") {
        // Google Sign-In
        const userData = {
          _id: emailOrUser.uid,
          name: emailOrUser.displayName,
          email: emailOrUser.email,
          token: emailOrUser.accessToken,
        };

        localStorage.setItem("user", JSON.stringify(userData));
        dispatch({ type: "LOGIN", payload: userData });
        navigate?.("/dashboard");
        return;
      }

      // ✅ Regular Email/Password Login
      const res = await api.post("/auth/login", { email: emailOrUser, password });
      const { data } = res;

      localStorage.setItem("user", JSON.stringify(data));
      dispatch({ type: "LOGIN", payload: data });
      navigate?.("/dashboard");
    } catch (error) {
      console.error("❌ Login Error:", error.response?.data?.message || "Login failed");
      alert(error.response?.data?.message || "❌ Login failed. Please try again.");
    }
  };

  // 🔥 Register Function
  const register = async (name, email, password) => {
    try {
      const res = await api.post("/auth/register", { name, email, password });
      const { data } = res;

      localStorage.setItem("user", JSON.stringify(data));
      dispatch({ type: "LOGIN", payload: data });

      alert("✅ Registration successful! Please log in.");
    } catch (error) {
      console.error("❌ Signup Error:", error.response?.data?.message || "Signup failed");
      alert(error.response?.data?.message || "❌ Registration failed. Please try again.");
    }
  };

  // 🔥 Logout Function
  const logout = async () => {
    try {
      await api.post("/auth/logout");
      dispatch({ type: "LOGOUT" });
    } catch (error) {
      console.error("❌ Logout Error:", error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Explicitly export AuthContext
export { AuthContext };
export default AuthContext;

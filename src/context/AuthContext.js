import { createContext, useReducer, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      console.log("✅ AuthContext Updated:", action.payload); // Debugging
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
  }, []);
  
  const login = async (emailOrUser, password, navigate) => {
    try {
      if (typeof emailOrUser === "object") {
        const userData = {
          _id: emailOrUser.uid,
          name: emailOrUser.displayName,
          email: emailOrUser.email,
          token: emailOrUser.accessToken,
        };

        localStorage.setItem("user", JSON.stringify(userData));
        dispatch({ type: "LOGIN", payload: userData });

        console.log("✅ Google Sign-In Successful:", userData);

        if (navigate) navigate("/dashboard"); // ✅ Added this check to prevent undefined navigate
        return;
      }

      // Regular Email/Password Login Flow
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: emailOrUser,
        password,
      });

      const { data } = res;

      localStorage.setItem("user", JSON.stringify(data));
      dispatch({ type: "LOGIN", payload: data });

      console.log("✅ AuthContext Updated:", data);
      navigate("/dashboard");
    } catch (error) {
      console.error("❌ Login Error:", error.response?.data?.message || "Login failed");
      alert("❌ Login failed. Please try again.");
    }
  };

  
  
  const register = async (name, email, password) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", { name, email, password });
      const { data } = res;
  
      localStorage.setItem("user", JSON.stringify(data));
      dispatch({ type: "LOGIN", payload: data });
  
      alert("✅ Registration successful! Please log in.");
    } catch (error) {
      console.error("❌ Signup Error:", error.response?.data?.message || "Signup failed");
      alert("❌ Registration failed. Please try again.");
    }
  };

  const logout = async () => {
    await axios.post("/api/auth/logout", {}, { withCredentials: true });
    dispatch({ type: "LOGOUT" });
  };

  axios.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  });

  return (
    <AuthContext.Provider value={{ ...state, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Explicitly export AuthContext
export { AuthContext };
export default AuthContext;

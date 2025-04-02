import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import FoodDonation from "./pages/FoodDonation";
import GreenScore from "./pages/GreenScore";
import BlogForm from "./pages/BlogForm";
import BlogDetails from "./pages/BlogDetails";
import FoodReceiver from "./pages/FoodReceiver";
import HeaderOne from "./components/HeaderOne"; // Login Page
import Navbar from "./components/Navbar";

// ✅ Protected Route: Restricts access to logged-in users
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useContext(AuthContext);
  return isAuthenticated && user ? children : <Navigate to="/login" />;
};

const MainLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <CssBaseline />
        <Routes>
          {/* Redirect Root to Login */}
          <Route path="/" element={<Navigate to="/login" />} />
          
          {/* Public Routes */}
          <Route path="/login" element={<HeaderOne />} />
          <Route path="/blogs/:id" element={<BlogDetails />} /> {/* Public Blog Details */}

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/food-donation"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <FoodDonation />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/food-receiver"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <FoodReceiver />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/green-score"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <GreenScore />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/blogs"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <BlogForm />
                </MainLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { CssBaseline, Button, Box } from "@mui/material";
import { Navigation } from "./components/Navigation";
import { Header } from "./components/Header";
import { Features } from "./components/Features";
import { About } from "./components/About";
import { Services } from "./components/Services";
import { Gallery } from "./components/Gallery";
import { Contact } from "./components/Contact";
import Dashboard from "./pages/Dashboard";
import FoodDonation from "./pages/FoodDonation";
import GreenScore from "./pages/GreenScore";
import BlogForm from "./pages/BlogForm";
import BlogDetails from "./pages/BlogDetails";
import FoodReceiver from "./pages/FoodReceiver"; // ✅ Import FoodReceiver page
import HeaderOne from "./components/HeaderOne";
import Navbar from "./components/Navbar";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import JsonData from "./data/data.json";
import SmoothScroll from "smooth-scroll";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import $ from "jquery";

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

// ✅ Protected Route: Restricts access to logged-in users
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useContext(AuthContext);
  return isAuthenticated && user ? children : <Navigate to="/login" />;
};

const LandingPage = () => {
  const [landingPageData, setLandingPageData] = useState({});

  useEffect(() => {
    setLandingPageData(JsonData);
  }, []);

  return (
    <div>
      <Navigation />
      <Header data={landingPageData.Header} />
      <Features data={landingPageData.Features} />
      <About data={landingPageData.About} />
      <Services data={landingPageData.Services} />
      <Gallery data={landingPageData.Gallery} />
      <Contact data={landingPageData.Contact} />
      <Box textAlign="center" my={4}>
        <Button variant="contained" color="primary" href="/login">
          Get Started
        </Button>
      </Box>
    </div>
  );
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
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
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
            path="/food-receiver" // ✅ Corrected route
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

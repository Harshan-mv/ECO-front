import React, { useState, useContext } from "react";
import {
  Container,
  Tabs,
  Tab,
  Box,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Link,
  CircularProgress,
} from "@mui/material";
import { Facebook, Google } from "@mui/icons-material";
import bgImage from "../assets/bg-cowork.jpeg";
import { auth, provider, signInWithPopup, signOut } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

// Reusable Motion Wrapper
const MotionBox = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4 }}
  >
    {children}
  </motion.div>
);

// SignIn Component
const SignIn = ({ handleGoogleLogin, loading, setLoading }) => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await login(email, password, navigate);
    setLoading(false);
  };

  return (
    <MotionBox>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography align="center">Sign in with:</Typography>
        <Box display="flex" justifyContent="center" gap={2}>
          <Button variant="outlined" startIcon={<Facebook color="primary" />} fullWidth>
            Facebook
          </Button>
          <Button
            variant="outlined"
            startIcon={<Google color="primary" />}
            fullWidth
            onClick={handleGoogleLogin}
          >
            Google
          </Button>
        </Box>

        <Typography align="center">or:</Typography>

        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          variant="outlined"
          fullWidth
          required
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          variant="outlined"
          fullWidth
          required
        />

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <FormControlLabel control={<Checkbox />} label="Remember me" />
          <Link href="#" variant="body2">Forgot password?</Link>
        </Box>

        <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : "SIGN IN"}
        </Button>

        <Typography align="center">
          Not a member? <Link href="#">Register</Link>
        </Typography>
      </Box>
    </MotionBox>
  );
};

// SignUp Component
const SignUp = ({ handleGoogleLogin, loading, setLoading }) => {
  const { register } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await register(name, email, password);
    if (success) {
      alert("✅ Registration successful! Please log in.");
      navigate("/login");
    }
    setLoading(false);
  };

  return (
    <MotionBox>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography align="center">Sign up with:</Typography>
        <Box display="flex" justifyContent="center" gap={2}>
          <Button variant="outlined" startIcon={<Facebook color="primary" />} fullWidth>
            Facebook
          </Button>
          <Button
            variant="outlined"
            startIcon={<Google color="primary" />}
            fullWidth
            onClick={handleGoogleLogin}
          >
            Google
          </Button>
        </Box>

        <Typography align="center">or:</Typography>

        <TextField
          label="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          variant="outlined"
          fullWidth
          required
        />
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          variant="outlined"
          fullWidth
          required
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          variant="outlined"
          fullWidth
          required
        />

        <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
          {loading ? <CircularProgress size={24} color="inherit" /> : "SIGN UP"}
        </Button>
      </Box>
    </MotionBox>
  );
};

function HeaderOne() {
  const [tabValue, setTabValue] = useState(0);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      await login(result.user, null, navigate);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("❌ Google Sign-In Error:", error);
      alert("❌ Google Sign-In Failed. Please try again.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    alert("✅ Successfully logged out!");
    navigate("/login");
  };

  return (
    <Box
      sx={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="xs" sx={{ p: 3, boxShadow: 3, borderRadius: 2, backgroundColor: "white" }}>
        <Typography variant="h4" align="center" sx={{ fontWeight: "bold", mb: 1 }}>
          {user ? `Welcome, ${user.displayName}` : "LOGIN"}
        </Typography>

        {!user && (
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} variant="fullWidth">
            <Tab label="LOGIN" sx={{ fontWeight: tabValue === 0 ? "bold" : "normal" }} />
            <Tab label="REGISTER" sx={{ fontWeight: tabValue === 1 ? "bold" : "normal" }} />
          </Tabs>
        )}

        <Box sx={{ p: 2 }}>
          {user ? (
            <Button variant="contained" color="secondary" fullWidth onClick={handleLogout}>
              LOG OUT
            </Button>
          ) : (
            <AnimatePresence mode="wait">
              {tabValue === 0 ? (
                <SignIn
                  key="signin"
                  handleGoogleLogin={handleGoogleLogin}
                  loading={loading}
                  setLoading={setLoading}
                />
              ) : (
                <SignUp
                  key="signup"
                  handleGoogleLogin={handleGoogleLogin}
                  loading={loading}
                  setLoading={setLoading}
                />
              )}
            </AnimatePresence>
          )}
        </Box>
      </Container>
    </Box>
  );
}

export default HeaderOne;

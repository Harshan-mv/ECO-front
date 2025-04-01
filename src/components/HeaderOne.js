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
} from "@mui/material";
import { Facebook, Google } from "@mui/icons-material";
import bgImage from "../assets/bg-cowork.jpeg";
import { auth, provider, signInWithPopup, signOut } from "../firebaseConfig"; 
import { useNavigate } from "react-router-dom"; 
import AuthContext from "../context/AuthContext";

// SignIn Component
const SignIn = ({ handleGoogleLogin }) => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();  // ✅ Added `navigate` here

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password, navigate);  // ✅ Pass `navigate` here
  };

  return (
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

      <Button type="submit" variant="contained" color="primary" fullWidth>
        SIGN IN
      </Button>

      <Typography align="center">
        Not a member? <Link href="#">Register</Link>
      </Typography>
    </Box>
  );
};

// SignUp Component
const SignUp = ({ handleGoogleLogin }) => {
  const { register } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();  // ✅ Added `navigate` here

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(name, email, password);
    alert("✅ Registration successful! Please log in.");
    navigate("/login");  // ✅ Redirect to login after successful registration
  };

  return (
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

      <Button type="submit" variant="contained" color="primary" fullWidth>
        SIGN UP
      </Button>
    </Box>
  );
};

function HeaderOne() {
  const [tabValue, setTabValue] = useState(0);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // Handle Google Login
 // ✅ Corrected Google Sign-In Logic
 const handleGoogleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("✅ User Logged In:", result.user);

    // Pass navigate as an argument for consistency
    login(result.user, null, navigate); // ✅ Added 'null' for password and 'navigate'

  } catch (error) {
    console.error("❌ Google Sign-In Error:", error);
    alert("❌ Google Sign-In Failed. Please try again.");
  }
};



  // Handle Logout
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
          ) : tabValue === 0 ? (
            <SignIn handleGoogleLogin={handleGoogleLogin} />
          ) : (
            <SignUp handleGoogleLogin={handleGoogleLogin} />
          )}
        </Box>
      </Container>
    </Box>
  );
}

export default HeaderOne;

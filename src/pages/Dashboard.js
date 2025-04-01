import React, { useEffect, useState, useContext } from "react";
import { Box, Typography, Grid, Card, CardContent, CardMedia } from "@mui/material";
import axios from "axios";
import AuthContext from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [blogs, setBlogs] = useState([]);
  const [greenScore, setGreenScore] = useState(null); // Default to null to check if it's fetched
  const [leaders, setLeaders] = useState([]); // Store leaderboard data

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/blogs");
        setBlogs(res.data);
      } catch (error) {
        console.error("❌ Failed to fetch blogs:", error.message);
      }
    };

    const fetchGreenScore = async () => {
      if (user && user._id) {
        try {
          console.log("Fetching Green Score for:", user._id);
          const res = await axios.get(`http://localhost:5000/api/green-score/${user._id}`);
          console.log("API Response:", res.data);
          setGreenScore(res.data.greenScore || 0); // Ensure it's not undefined
        } catch (error) {
          console.error("❌ Failed to fetch Green Score:", error.message);
        }
      }
    };

    const fetchLeaders = async () => {
      try {
        console.log("Fetching leaderboard...");
        const res = await axios.get("http://localhost:5000/api/green-score/leaders");
        console.log("Leaderboard API  Response:", res.data);
        setLeaders(res.data.leaders);
      } catch (error) {
        console.error("❌ Failed to fetch leaderboard:", error.message);
      }
    };

    fetchBlogs();

    if (user) {
      fetchGreenScore();
    }

    fetchLeaders(); // Fetch leaderboard data

  }, [user]);

  // Determine Badge Based on Green Score
  const getBadge = (score) => {
    if (score > 100) return "♻️ Eco Warrior";
    if (score > 50) return "🌎 Sustainability Champion";
    if (score > 20) return "🌿 Green Enthusiast";
    return "🌱 Eco Beginner";
  };

  return (
    <Box sx={{ width: "100%", p: 2, bgcolor: "#f5fffa" }}>
      <Grid container spacing={2}>
  
        {/* Left Section - Leaderboard */}
        <Grid item xs={12} md={6}>
          <Box sx={{ bgcolor: "#daa520", p: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              🌟 Leaderboard
            </Typography>
            {leaders.length > 0 ? (
              <>
                <Typography variant="h6" fontWeight="bold">
                  🏆 {leaders[0].name} - {leaders[0].greenScore} Points
                </Typography>
                {leaders[1] && (
                  <Typography variant="h6" sx={{ mt: 1, fontStyle: "italic" }}>
                    🥈 {leaders[1].name} - {leaders[1].greenScore} Points
                  </Typography>
                )}
              </>
            ) : (
              <Typography variant="body1">No leaders yet</Typography>
            )}
          </Box>
        </Grid>
  
        {/* Right Section - Green Score & Badge */}
        <Grid item xs={12} md={6}>
          <Box sx={{ bgcolor: "#e8f5e9", p: 3, borderRadius: 2 }}>
            {/* Welcome Message */}
          <Typography variant="h6" fontWeight="italic" sx={{color: "#339933" }}>
              👋 Welcome, {user?.name || "User"}!
          </Typography>
            <Typography variant="h6" fontWeight="bold" sx={{ color: "#388E3C" }}>
              🌱 Your Green Score: {greenScore !== null ? greenScore : "Loading..."}
            </Typography>
            <Typography variant="h6" sx={{ mt: 1, color: "#2e7d32", fontWeight: "bold" }}>
              🏅 Badge: {greenScore !== null ? getBadge(greenScore) : "Loading..."}
            </Typography>
          </Box>
        </Grid>
  
      </Grid>
  
      {/* Blog Section */}
      <Grid container spacing={3} sx={{ mt: 4 }}>
  {blogs.map((blog) => (
    <Grid key={blog._id} item xs={12} sm={4}>
      <a
        href={`/blogs/${blog._id}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: 'none' }}
      >
        <Card sx={{ cursor: "pointer", display: "flex", flexDirection: "column", height: "100%" }}>
          {blog.image && (
            <CardMedia
              component="img"
              height="200"
              image={blog.image || "/images/byte&backpacklogo.jpg"}
              alt={blog.title}
            />
          )}
          <CardContent sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight="bold">
              {blog.title}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Author: {blog.author}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {blog.content.slice(0, 100)}...
            </Typography>
          </CardContent>
        </Card>
      </a>
    </Grid>
  ))}
</Grid>

    </Box>
  );
  
};

export default Dashboard;

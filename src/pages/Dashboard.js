import React, { useEffect, useState, useContext } from "react";
import { Box, Typography, Grid, Card, CardContent, CardMedia, IconButton } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import api from "../utils/api";
import AuthContext from "../context/AuthContext";
import axios from "axios";
const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [blogs, setBlogs] = useState([]);
  const [greenScore, setGreenScore] = useState(null);
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get("/blogs");
        setBlogs(res.data);
      } catch (error) {
        console.error("❌ Failed to fetch blogs:", error.message);
      }
    };

    const fetchGreenScore = async () => {
      if (user && user._id) {
        try {
          console.log("Fetching Green Score for:", user._id);
          const res = await api.get(`/green-score/${user._id}`);
          console.log("API Response:", res.data);
          setGreenScore(res.data.greenScore || 0);
        } catch (error) {
          console.error("❌ Failed to fetch Green Score:", error.message);
        }
      }
    };

    const fetchLeaders = async () => {
      try {
        console.log("Fetching leaderboard...");
        const res = await api.get("/green-score/leaders");
        console.log("Leaderboard API Response:", res.data);
        setLeaders(res.data.leaders);
      } catch (error) {
        console.error("❌ Failed to fetch leaderboard:", error.message);
      }
    };

    fetchBlogs();

    if (user) {
      fetchGreenScore();
    }

    fetchLeaders();
  }, [user]);

  const handleDelete = async (blogId) => {
    try {
      await axios.delete(`/api/blogs/${blogId}`);
      setBlogs(blogs.filter((blog) => blog._id !== blogId)); // Remove from UI
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };
  
  
  const getBadge = (score) => {
    if (score > 100) return "♻️ Eco Warrior";
    if (score > 50) return "🌎 Sustainability Champion";
    if (score > 20) return "🌿 Green Enthusiast";
    return "🌱 Eco Beginner";
  };

  return (
    <Box sx={{ width: "100%", p: 2, bgcolor: "#f5fffa" }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Box sx={{ bgcolor: "#daa520", p: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold">🌟 Leaderboard</Typography>
            {leaders.length > 0 ? (
              <>
                <Typography variant="h6" fontWeight="bold">🏆 {leaders[0].name} - {leaders[0].greenScore} Points</Typography>
                {leaders[1] && (
                  <Typography variant="h6" sx={{ mt: 1, fontStyle: "italic" }}>🥈 {leaders[1].name} - {leaders[1].greenScore} Points</Typography>
                )}
              </>
            ) : (
              <Typography variant="body1">No leaders yet</Typography>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box sx={{ bgcolor: "#e8f5e9", p: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="italic" sx={{ color: "#339933" }}>👋 Welcome, {user?.name || "User"}!</Typography>
            <Typography variant="h6" fontWeight="bold" sx={{ color: "#388E3C" }}>🌱 Your Green Score: {greenScore !== null ? greenScore : "Loading..."}</Typography>
            <Typography variant="h6" sx={{ mt: 1, color: "#2e7d32", fontWeight: "bold" }}>🏅 Badge: {greenScore !== null ? getBadge(greenScore) : "Loading..."}</Typography>
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 4 }}>
        {blogs.map((blog) => (
          <Grid key={blog._id} item xs={12} sm={4}>
            <a href={`/blogs/${blog._id}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <Card sx={{ cursor: "pointer", display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
              {blog.image && (
                <CardMedia
                  component="img"
                  height="200"
                  image={blog.image} // ✅ Direct Cloudinary URL
                  alt={blog.title}
                />
              )}

                <CardContent sx={{ flex: 1, position: "relative" }}>
                  <Typography variant="h6" fontWeight="bold">{blog.title}</Typography>
                  <Typography variant="body2" color="textSecondary">Author: {blog.author}</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>{blog.content.slice(0, 100)}...</Typography>

                  {/* Delete Icon - Only for Author */}
                  {user?.name === blog.author && (
                    <IconButton
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete(blog._id);
                      }}
                      sx={{ position: "absolute", top: 0, right: 0, color: "red" }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
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

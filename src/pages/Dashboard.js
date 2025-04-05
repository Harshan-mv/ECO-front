import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Backdrop,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Slide
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { OrbitProgress } from "react-loading-indicators";
import { motion } from "framer-motion";
import api from "../utils/api";
import AuthContext from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [blogs, setBlogs] = useState([]);
  const [greenScore, setGreenScore] = useState(null);
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Snackbar & Dialog states
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [blogsRes, greenScoreRes, leadersRes] = await Promise.all([
          api.get("/blogs"),
          user?._id ? api.get(`/green-score/${user._id}`) : Promise.resolve({ data: { greenScore: 0 } }),
          api.get("/green-score/leaders"),
        ]);
        setBlogs(blogsRes.data);
        setGreenScore(greenScoreRes.data.greenScore || 0);
        setLeaders(leadersRes.data.leaders);
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleDeleteConfirm = async () => {
    if (!selectedBlogId) return;
    setLoading(true);
    try {
      await api.delete(`/blogs/${selectedBlogId}`);
      setBlogs((prev) => prev.filter((blog) => blog._id !== selectedBlogId));
      setSnackbarOpen(true); // ✅ Show success message
    } catch (error) {
      console.error("Failed to delete:", error);
    } finally {
      setDeleteDialogOpen(false);
      setLoading(false);
    }
  };

  const openDeleteDialog = (id) => {
    setSelectedBlogId(id);
    setDeleteDialogOpen(true);
  };

  const getBadge = (score) => {
    if (score > 100) return "♻️ Eco Warrior";
    if (score > 50) return "🌎 Sustainability Champion";
    if (score > 20) return "🌿 Green Enthusiast";
    return "🌱 Eco Beginner";
  };

  return (
    <Box sx={{ width: "100%", p: 2, bgcolor: "#f5fffa" }}>
      {/* Loading Spinner */}
      <Backdrop open={loading} sx={{ zIndex: 9999, color: "#fff", flexDirection: "column" }}>
        <OrbitProgress color={["#3160cc", "#cc31ad", "#cc9d31", "#31cc4f"]} size={100} />
        <Typography mt={2}>Loading...</Typography>
      </Backdrop>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this blog?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for success */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="✅ Blog deleted successfully"
        TransitionComponent={Slide}
      />

      {/* Leaderboard and User Info */}
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

      {/* Blog Cards */}
      <Grid container spacing={3} sx={{ mt: 4 }}>
        {blogs.map((blog, i) => (
          <Grid key={blog._id} item xs={12} sm={4}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <a href={`/blogs/${blog._id}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <Card sx={{ cursor: "pointer", display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
                  {blog.image && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={blog.image}
                      alt={blog.title}
                    />
                  )}
                  <CardContent sx={{ flex: 1, position: "relative" }}>
                    <Typography variant="h6" fontWeight="bold">{blog.title}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Author: {typeof blog.author === "object" ? blog.author.name : blog.author}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>{blog.content.slice(0, 100)}...</Typography>

                    {user && blog.author && blog.author._id === user._id && (
                      <IconButton
                        onClick={(e) => {
                          e.preventDefault();
                          openDeleteDialog(blog._id);
                        }}
                        sx={{ position: "absolute", top: 0, right: 0, color: "red" }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </CardContent>
                </Card>
              </a>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;

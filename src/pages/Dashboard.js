// Imports
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
  Slide,
  Drawer,
  Divider,
  Avatar,
  Tooltip,
} from "@mui/material";
import { Delete as DeleteIcon, Close as CloseIcon } from "@mui/icons-material";
import { OrbitProgress } from "react-loading-indicators";
import { motion } from "framer-motion";
import api from "../utils/api";
import AuthContext from "../context/AuthContext";
import { LoadingButton } from "@mui/lab"; // ✅ Imported LoadingButton

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [blogs, setBlogs] = useState([]);
  const [greenScore, setGreenScore] = useState(null);
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState(null);
  const [openViewer, setOpenViewer] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentLoading, setCommentLoading] = useState(false); // ✅ Comment loading state
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const loggedInUserId = storedUser?._id || "";

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
      setSnackbarOpen(true);
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
    if (score >= 150) return "Eco leader";
    if (score > 100) return "♻️ Eco Warrior";
    if (score > 50) return "🌎 Sustainability Champion";
    if (score > 20) return "🌿 Green Enthusiast";
    return "🌱 Eco Beginner";
  };

  const handleOpenViewer = async (blog) => {
    setSelectedBlog(blog);
    setOpenViewer(true);
    try {
      const res = await api.get(`/blogs/${blog._id}`);
      setComments(res.data.comments || []);
    } catch (err) {
      console.error("Failed to load comments:", err);
    }
  };

  const handleCloseViewer = () => {
    setSelectedBlog(null);
    setComments([]);
    setOpenViewer(false);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setCommentLoading(true); // ✅ Start loading
    try {
      const res = await api.post(`/blogs/${selectedBlog._id}/comments`, {
        user: user?._id,
        text: newComment,
      });
      setComments(res.data.comments);
      setNewComment("");
    } catch (err) {
      console.error("❌ Error adding comment:", err?.response?.data || err.message || err);
    } finally {
      setCommentLoading(false); // ✅ Stop loading
    }
  };

  return (
    <Box sx={{ width: "100%", p: 2, bgcolor: "#f5fffa" }}>
      <Backdrop open={loading} sx={{ zIndex: 9999, color: "#fff", flexDirection: "column" }}>
        <OrbitProgress color={["#3160cc", "#cc31ad", "#cc9d31", "#31cc4f"]} size={100} />
        <Typography mt={2}>Loading...</Typography>
      </Backdrop>

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

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="✅ Blog deleted successfully"
        TransitionComponent={Slide}
      />

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
            <Typography variant="h6" fontWeight="bold" sx={{ color: "#388E3C" }}>🌱 Your Green Score: {greenScore}</Typography>
            <Typography variant="h6" sx={{ mt: 1, color: "#2e7d32", fontWeight: "bold" }}>🏅 Badge: {getBadge(greenScore)}</Typography>
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mt: 4 }}>
        {blogs.map((blog, i) => (
          <Grid key={blog._id} item xs={12} sm={4}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Card
                onClick={() => handleOpenViewer(blog)}
                sx={{ cursor: "pointer", display: "flex", flexDirection: "column", height: "100%", position: "relative" }}
              >
                {blog.image && (
                  <CardMedia component="img" height="200" image={blog.image} alt={blog.title} />
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
                        e.stopPropagation();
                        openDeleteDialog(blog._id);
                      }}
                      sx={{ position: "absolute", top: 0, right: 0, color: "red" }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Drawer
        anchor="right"
        open={openViewer}
        onClose={handleCloseViewer}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: "75%" },
            p: 3,
            display: "flex",
            flexDirection: "column",
          },
        }}
      > {/* blog preview */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold">📝 Blog</Typography>
          <IconButton onClick={handleCloseViewer}><CloseIcon /></IconButton>
        </Box>
        <Divider sx={{ my: 2 }} />

        {selectedBlog && (
          <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
            {selectedBlog.image && (
              <CardMedia
                component="img"
                height="250"
                image={selectedBlog.image}
                alt={selectedBlog.title}
                sx={{ borderRadius: 2, mb: 2 }}
              />
            )}
            <Typography variant="h5" fontWeight="bold">{selectedBlog.title}</Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Author: {typeof selectedBlog.author === "object" ? selectedBlog.author.name : selectedBlog.author}
            </Typography>
            <Typography variant="body1" sx={{ mt: 2, whiteSpace: "pre-line" }}>
              {selectedBlog.content}
            </Typography>
              {/* comments */}
                  <Box sx={{ mt: 4 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>💬 Comments</Typography>

              <Box sx={{ maxHeight: 200, overflowY: "auto", mb: 2 }}>
                {comments.length > 0 ? comments.map((c, i) => {
                  const userName = typeof c.user === "string"
                    ? c.user
                    : c.user?.name || "Unknown";

                  const isUserComment = loggedInUserId &&
                    (c.user === loggedInUserId || c.user?._id === loggedInUserId);

                  return (
                    <Box
                      key={i}
                      display="flex"
                      alignItems="flex-start"
                      gap={2}
                      justifyContent="space-between"
                      sx={{ mb: 1, bgcolor: "#f1f1f1", p: 1.5, borderRadius: 2 }}
                    >
                      <Box display="flex" gap={1} sx={{ flexGrow: 1 }}>
                        <Avatar sx={{ bgcolor: "#1976d2" }}>
                          {userName.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="bold">
                            {userName}
                          </Typography>
                          <Typography variant="body2">{c.text}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(c.timestamp).toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>

                      {isUserComment && (
                        <IconButton
                          onClick={async () => {
                            try {
                              const token = user?.token || JSON.parse(localStorage.getItem("user"))?.token;
                              if (!token) return;
                              await api.delete(`/blogs/${selectedBlog._id}/comments/${c._id}`, {
                                headers: { Authorization: `Bearer ${token}` },
                              });
                              setComments((prev) => prev.filter((comment) => comment._id !== c._id));
                            } catch (err) {
                              console.error("❌ Error deleting comment:", err?.response?.data || err.message);
                            }
                          }}
                          size="small"
                          sx={{ color: "red", mt: 1 }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  );
                }) : (
                  <Typography variant="body2">No comments yet.</Typography>
                )}
              </Box>

              {/* ✅ Comment input field */}
              <Box display="flex" gap={1}>
                <input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                  }}
                />
                <LoadingButton
                  variant="contained"
                  onClick={handleAddComment}
                  loading={commentLoading}
                >
                  Send
                </LoadingButton>
              </Box>
            </Box>
          </Box>
        )}
      </Drawer>
    </Box>
  );
};

export default Dashboard;

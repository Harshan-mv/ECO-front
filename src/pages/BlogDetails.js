import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Box,
  Backdrop,
  Grid
} from "@mui/material";
import { OrbitProgress } from "react-loading-indicators";
import { motion } from "framer-motion";
import api from "../utils/api";

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);

  const loggedInUser = localStorage.getItem("username") || "Guest";

  useEffect(() => {
    const fetchBlogDetails = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/blogs/${id}`);
        setBlog(res.data);
        setComments(res.data.comments || []);
      } catch (error) {
        console.error("❌ Failed to fetch blog details:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetails();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      user: loggedInUser,
      text: commentText,
      timestamp: new Date().toISOString(),
    };

    try {
      await api.post(`/blogs/${id}/comments`, newComment);
      setComments((prevComments) => [...prevComments, newComment]);
      setCommentText("");
    } catch (error) {
      console.error("❌ Failed to add comment:", error.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <Backdrop open={true} sx={{ zIndex: 9999, color: "#fff", flexDirection: "column" }}>
        <OrbitProgress color={["#3160cc", "#cc31ad", "#cc9d31", "#31cc4f"]} size={100} />
        <Typography mt={2}>Loading blog...</Typography>
      </Backdrop>
    );
  }

  return (
    <Container maxWidth="lg">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Grid container spacing={2} mt={3}>
          {/* Main Content */}
          <Grid item xs={12} md={9}>
            <Card>
              {blog.image && (
                <CardMedia
                  component="img"
                  height="400"
                  image={blog.image}
                  alt={blog.title}
                />
              )}
              <CardContent>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {blog.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Author: <strong>{typeof blog.author === "object" ? blog.author.name : blog.author}</strong>
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Published on: <strong>{formatDate(blog.createdAt)}</strong>
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  {blog.content}
                </Typography>

                {/* Comments Section */}
                <Typography variant="h6" sx={{ mt: 3 }}>
                  Comments
                </Typography>
                <List>
                  {comments.length > 0 ? (
                    comments.map((c, index) => (
                      <ListItem key={index} sx={{ alignItems: "flex-start" }}>
                        <Avatar sx={{ bgcolor: "gray", mr: 2 }}>👤</Avatar>
                        <ListItemText primary={c.text} secondary={c.user} />
                      </ListItem>
                    ))
                  ) : (
                    <Typography sx={{ ml: 2, mt: 1, fontStyle: "italic" }}>
                      No comments yet. Be the first to comment!
                    </Typography>
                  )}
                </List>

                {/* Comment Form */}
                <Box sx={{ display: "flex", alignItems: "center", mt: 2, gap: 2 }}>
                  <Avatar sx={{ bgcolor: "gray" }}>👤</Avatar>
                  <TextField
                    placeholder="What's on your mind?"
                    variant="outlined"
                    fullWidth
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <Button
                    onClick={handleCommentSubmit}
                    variant="contained"
                    color="primary"
                    sx={{ whiteSpace: "nowrap" }}
                  >
                    Post
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar Placeholder */}
          <Grid item xs={12} md={3}>
            {/* Sidebar content goes here */}
            <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
              <Typography variant="h6">Sidebar</Typography>
              {/* Add sidebar components or content here */}
            </Box>
          </Grid>
        </Grid>
      </motion.div>
    </Container>
  );
};

export default BlogDetails;

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
} from "@mui/material";
import axios from "axios";

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  // Simulated logged-in user
  const loggedInUser = localStorage.getItem("username") || "Guest";

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/blogs/${id}`);
        setBlog(res.data);
        setComments(res.data.comments || []);
      } catch (error) {
        console.error("❌ Failed to fetch blog details:", error.message);
      }
    };

    fetchBlogDetails();
  }, [id]);

  // Handle Comment Submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      user: loggedInUser,
      text: commentText,
      timestamp: new Date().toISOString(),
    };

    try {
      await axios.post(`http://localhost:5000/api/blogs/${id}/comments`, newComment);
      setComments([...comments, newComment]); // Update UI instantly
      setCommentText(""); // Clear input
    } catch (error) {
      console.error("❌ Failed to add comment:", error.message);
    }
  };

  if (!blog) {
    return <Typography>Loading...</Typography>;
  }

  // ✅ Format Date for Better Readability
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Container maxWidth="md">
      <Card>
        {blog.image && (
          <CardMedia component="img" height="400" image={blog.image} alt={blog.title} />
        )}
        <CardContent>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {blog.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Author: <strong>{blog.author}</strong>
          </Typography>

          {/* ✅ Date of Publish */}
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Published on: <strong>{formatDate(blog.createdAt)}</strong>
          </Typography>

          <Typography variant="body1" sx={{ mt: 2 }}>
            {blog.content}
          </Typography>

          {/* Comment Section */}
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
              <Typography>No comments yet. Be the first to comment!</Typography>
            )}
          </List>

          {/* Add Comment Form */}
          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            <Avatar sx={{ bgcolor: "gray", mr: 2 }}>👤</Avatar>
            <TextField
              placeholder="What's on your mind?"
              variant="outlined"
              fullWidth
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <Button onClick={handleCommentSubmit} variant="contained" color="primary" sx={{ ml: 2 }}>
              Post
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default BlogDetails;

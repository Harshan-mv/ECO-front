import React, { useState, useContext } from "react";
import { TextField, Button, Typography, Container, Box } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Added for navigation
import api from "../utils/api";
import AuthContext from "../context/AuthContext"; // Imported for author details

const BlogForm = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate(); // Added for navigation

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "/images/byte&backpacklogo.jpg", // Default image
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageFormData = new FormData();
      imageFormData.append("file", file);
      imageFormData.append("upload_preset", "your_upload_preset"); // Replace with your actual upload preset
  
      try {
        const res = await fetch("https://api.cloudinary.com/v1_1/dxq7c4jok/image/upload", {
          method: "POST",
          body: imageFormData,
        });
  
        const data = await res.json();
        setFormData({ ...formData, image: data.secure_url }); // ✅ Cloudinary URL
      } catch (error) {
        console.error("❌ Cloudinary Upload Failed:", error.message);
      }
    }
  };

  // ✅ Reset Button Functionality
  const handleReset = () => {
    setFormData({
      title: "",
      content: "",
      image: "/images/byte&backpacklogo.jpg",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newBlog = {
      ...formData,
      author: user?.name || "Anonymous",
    };

    try {
      const res = await api.post("/blogs", newBlog);
      console.log("✅ Blog Created:", res.data);

      // ✅ Alert + Navigate to Dashboard
      alert("✅ Blog published successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("❌ Blog Creation Failed:", error.response?.data?.message);
      alert("❌ Failed to publish blog.");
    }
  };

  return (
    <Container maxWidth="md">
      {/* Image Preview */}
      <Box
        sx={{
          width: "100%",
          height: "300px",
          backgroundImage: `url(${formData.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "8px",
          mb: 3,
        }}
      />

      {/* Blog Title */}
      <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
        Create a New Blog
      </Typography>

      <Typography variant="h5" align="center" color="textSecondary" gutterBottom>
        Share your thoughts and experiences
      </Typography>

      {/* Image Upload */}
      <Typography variant="h6" sx={{ fontWeight: "bold", mt: 2, mb: 1 }}>
        Upload Image
      </Typography>
      <input type="file" accept="image/*" onChange={handleImageChange} />

      {/* Blog Form */}
      <form onSubmit={handleSubmit}>
        {/* Title Input */}
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
          Title
        </Typography>
        <TextField
          name="title"
          fullWidth
          value={formData.title}
          onChange={handleChange}
          margin="normal"
          required
          variant="outlined"
        />

        {/* Content Input */}
        <Typography variant="h6" sx={{ fontWeight: "bold", mt: 2, mb: 1 }}>
          Content
        </Typography>
        <TextField
          name="content"
          fullWidth
          multiline
          rows={6}
          value={formData.content}
          onChange={handleChange}
          margin="normal"
          required
          variant="outlined"
        />

        {/* Buttons: Submit & Reset */}
        <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ py: 1.5 }}
          >
            Publish
          </Button>

          <Button
            type="button"
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={handleReset}
            sx={{ py: 1.5 }}
          >
            Reset
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default BlogForm;

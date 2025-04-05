import React, { useState, useContext } from "react";
import { TextField, Button, Typography, Container, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import AuthContext from "../context/AuthContext";
import { OrbitProgress } from "react-loading-indicators";

const BlogForm = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "/images/byte&backpacklogo.jpg",
  });

  const [loading, setLoading] = useState(false); // Blog submission
  const [uploading, setUploading] = useState(false); // Image uploading

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageFormData = new FormData();
      imageFormData.append("file", file);
      imageFormData.append("upload_preset", "cloudinarypreset");

      try {
        setUploading(true);
        const res = await fetch("https://api.cloudinary.com/v1_1/dxq7c4jok/image/upload", {
          method: "POST",
          body: imageFormData,
        });

        const data = await res.json();
        setFormData({ ...formData, image: data.secure_url });
      } catch (error) {
        console.error("❌ Cloudinary Upload Failed:", error.message);
        alert("❌ Failed to upload image.");
      } finally {
        setUploading(false);
      }
    }
  };

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
      author: user?._id,
    };

    try {
      setLoading(true);
      const res = await api.post("/blogs", newBlog);
      console.log("✅ Blog Created:", res.data);
      alert("✅ Blog published successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("❌ Blog Creation Failed:", error.response?.data?.message);
      alert("❌ Failed to publish blog.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      {/* 🔄 Fullscreen Loader Overlay */}
      {(loading || uploading) && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <OrbitProgress color={["#3160cc", "#cc31ad", "#cc9d31", "#31cc4f"]} />
        </Box>
      )}

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

      <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
        Create a New Blog
      </Typography>

      <Typography variant="h5" align="center" color="textSecondary" gutterBottom>
        Share your thoughts and experiences
      </Typography>

      <Typography variant="h6" sx={{ fontWeight: "bold", mt: 2, mb: 1 }}>
        Upload Image
      </Typography>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        disabled={uploading || loading}
      />

      <form onSubmit={handleSubmit}>
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
          disabled={loading}
        />

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
          disabled={loading}
        />

        <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ py: 1.5 }}
            disabled={loading || uploading}
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
            disabled={loading || uploading}
          >
            Reset
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default BlogForm;

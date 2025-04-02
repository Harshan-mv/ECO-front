import React, { useState } from "react";
import { TextField, Button, Typography, MenuItem, Card, CardContent } from "@mui/material";
import Tesseract from "tesseract.js";
import api from "../utils/api"; // Import global Axios instance

// Bill-related dropdown options
const billTypes = ["Purchase Bill", "Consumable Bill"];
const purchaseModes = ["Online", "Offline", "Local Store"];
const ecoCertifications = ["None", "USDA Organic", "Energy Star", "Fair Trade"];

const GreenScoreForm = () => {
  const [formData, setFormData] = useState({
    billType: "",
    billNumber: "",
    itemPurchased: "",
    purchaseDate: "",
    vendor: "",
    purchaseMode: "",
    ecoCertification: "None",
    totalAmount: "",
    billImage: null,
    score: 0,
    ocrProcessing: false,
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, billImage: file, ocrProcessing: true });
      extractTextFromImage(file);
    }
  };

  const extractTextFromImage = (imageFile) => {
    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onload = () => {
      Tesseract.recognize(reader.result, "eng", {
        logger: (m) => console.log(m),
      })
        .then(({ data: { text } }) => {
          console.log("OCR Result:", text);
          processOCRData(text);
        })
        .catch((err) => console.error("OCR Error:", err))
        .finally(() => setFormData((prev) => ({ ...prev, ocrProcessing: false })));
    };
  };

  const processOCRData = (text) => {
    const lines = text.split("\n").map((line) => line.trim());
    let extractedData = {
      billNumber: (lines.find((line) => line.toLowerCase().includes("bill number")) || "").split(":").pop().trim(),
      itemPurchased: (lines.find((line) => line.toLowerCase().includes("item")) || "").split(":").pop().trim(),
      vendor: (lines.find((line) => line.toLowerCase().includes("vendor")) || "").split(":").pop().trim(),
      totalAmount: (lines.find((line) => line.toLowerCase().includes("amount")) || "").split(":").pop().trim(),
    };

    let dateString = (lines.find((line) => line.toLowerCase().includes("date of purchase")) || "").split(":").pop().trim();
    let formattedDate = formatDateToYYYYMMDD(dateString);
    extractedData.purchaseDate = formattedDate;

    setFormData((prev) => ({ ...prev, ...extractedData }));
  };

  const formatDateToYYYYMMDD = (dateString) => {
    const dateParts = dateString.split("/");
    if (dateParts.length === 3) {
      return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = localStorage.getItem("user");
    const parsedUser = userData ? JSON.parse(userData) : null;
    const userId = parsedUser ? parsedUser._id : null;

    if (!userId) {
      alert("User ID not found. Please log in again.");
      return;
    }

    const submissionData = { ...formData, userId };

    try {
      const response = await api.post("/green-score/submit", submissionData);
      if (response.data.success) {
        alert("Green Score submitted successfully!");
      } else {
        alert("Error submitting score: " + response.data.message);
      }
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  return (
    <Card sx={{ maxWidth: 600, margin: "auto", mt: 4, p: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h4" align="center" gutterBottom>
          Green Score Submission
        </Typography>
        <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: "block", margin: "auto", marginBottom: "16px" }} />
        {formData.ocrProcessing && <Typography variant="body2" align="center">Processing OCR...</Typography>}
        <form onSubmit={handleSubmit}>
          <TextField select label="Bill Type" fullWidth value={formData.billType} onChange={(e) => setFormData({ ...formData, billType: e.target.value })} margin="normal">
            {billTypes.map((type) => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </TextField>
          <TextField label="Bill Number" fullWidth value={formData.billNumber} onChange={(e) => setFormData({ ...formData, billNumber: e.target.value })} margin="normal" />
          <TextField label="Item Purchased" fullWidth value={formData.itemPurchased} onChange={(e) => setFormData({ ...formData, itemPurchased: e.target.value })} margin="normal" />
          <TextField label="Date of Purchase" type="date" fullWidth value={formData.purchaseDate} onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })} margin="normal" InputLabelProps={{ shrink: true }} />
          <TextField label="Vendor/Supplier" fullWidth value={formData.vendor} onChange={(e) => setFormData({ ...formData, vendor: e.target.value })} margin="normal" />
          <TextField label="Total Amount" type="number" fullWidth value={formData.totalAmount} onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })} margin="normal" />
          <TextField select label="Purchase Mode" fullWidth value={formData.purchaseMode} onChange={(e) => setFormData({ ...formData, purchaseMode: e.target.value })} margin="normal">
            {purchaseModes.map((mode) => (
              <MenuItem key={mode} value={mode}>{mode}</MenuItem>
            ))}
          </TextField>
          <TextField select label="Eco Certification" fullWidth value={formData.ecoCertification} onChange={(e) => setFormData({ ...formData, ecoCertification: e.target.value })} margin="normal">
            {ecoCertifications.map((cert) => (
              <MenuItem key={cert} value={cert}>{cert}</MenuItem>
            ))}
          </TextField>
          <Button type="submit" variant="contained" sx={{ mt: 2, backgroundColor: "#0288d1", color: "white", ':hover': { backgroundColor: "#0277bd" } }} fullWidth>
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default GreenScoreForm;

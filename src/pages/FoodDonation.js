import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const FoodDonationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    contactNumber: "",
    foodType: "Perishable",
    quantity: "",
    weight: "",
    cookingDate: "",
    expiryDate: "",
    storageInstructions: "",
    pickupAddress: "",
    foodImage: null,
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, foodImage: file });
  };

  const validateDates = () => {
    const today = new Date().setHours(0, 0, 0, 0); // Remove time for strict comparison
    const cookingDate = new Date(formData.cookingDate).setHours(0, 0, 0, 0);
    const expiryDate = new Date(formData.expiryDate).setHours(0, 0, 0, 0);

    if (!formData.cookingDate || !formData.expiryDate) {
      alert("Please enter both Cooking Date and Expiry Date.");
      return false;
    }

    if (cookingDate > today) {
      alert("Cooking date cannot be in the future.");
      return false;
    }

    if (cookingDate >= expiryDate) {
      alert("Cooking date must be before expiry date.");
      return false;
    }

    if (expiryDate <= today) {
      alert("Expiry date must be in the future.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateDates()) {
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("fullName", formData.fullName);
    formDataToSend.append("contactNumber", formData.contactNumber);
    formDataToSend.append("foodType", formData.foodType);
    formDataToSend.append("itemName", formData.quantity);
    formDataToSend.append("weight", formData.weight);
    formDataToSend.append("cookingDate", formData.cookingDate);
    formDataToSend.append("expiryDate", formData.expiryDate);
    formDataToSend.append("storageInstructions", formData.storageInstructions);
    formDataToSend.append("pickupAddress", formData.pickupAddress);
    if (formData.foodImage) {
      formDataToSend.append("foodImage", formData.foodImage);
    }

    try {
      const response = await fetch("http://localhost:5000/api/food-donations", {
        method: "POST",
        body: formDataToSend,
      });

      const result = await response.json();
      if (response.ok) {
        alert("Donation Submitted Successfully!");
        console.log("Response:", result);
        navigate("/dashboard");
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error submitting donation:", error);
      alert("An error occurred while submitting your donation.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h4">Food Donation Form</Typography>

      {/* Contact Information */}
      <TextField
        label="Full Name"
        fullWidth
        value={formData.fullName}
        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
        margin="normal"
      />
      <TextField
        label="Contact Number"
        fullWidth
        value={formData.contactNumber}
        onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
        margin="normal"
      />

      {/* Food Type Selection */}
      <FormControl fullWidth margin="normal">
        <InputLabel>Food Type</InputLabel>
        <Select value={formData.foodType} onChange={(e) => setFormData({ ...formData, foodType: e.target.value })}>
          <MenuItem value="Perishable">Perishable</MenuItem>
          <MenuItem value="None">None</MenuItem>
          <MenuItem value="Non-perishable">Non-perishable</MenuItem>
        </Select>
      </FormControl>

      {/* Item & Weight */}
      <TextField
        label="Item Name"
        fullWidth
        type="text"
        value={formData.quantity}
        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
        margin="normal"
      />
      <TextField
        label="Weight (Kg/Lbs)"
        fullWidth
        type="number"
        value={formData.weight}
        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
        margin="normal"
      />

      {/* Cooking & Expiry Date */}
      <TextField
        label="Cooking Date"
        type="date"
        fullWidth
        InputLabelProps={{ shrink: true }}
        value={formData.cookingDate}
        onChange={(e) => setFormData({ ...formData, cookingDate: e.target.value })}
        margin="normal"
      />
      <TextField
        label="Expiry Date"
        type="date"
        fullWidth
        InputLabelProps={{ shrink: true }}
        value={formData.expiryDate}
        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
        margin="normal"
      />

      {/* Storage Instructions */}
      <TextField
        label="Storage Instructions"
        fullWidth
        multiline
        rows={2}
        value={formData.storageInstructions}
        onChange={(e) => setFormData({ ...formData, storageInstructions: e.target.value })}
        margin="normal"
      />

      {/* Pickup Address */}
      <TextField
        label="Pickup Address"
        fullWidth
        value={formData.pickupAddress}
        onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
        margin="normal"
      />

      {/* Food Image Upload */}
      <input type="file" accept="image/*" onChange={handleImageChange} style={{ margin: "10px 0" }} />

      {/* Submit Button */}
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Submit
      </Button>
    </form>
  );
};

export default FoodDonationForm;

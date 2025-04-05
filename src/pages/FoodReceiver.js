import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Typography,
  CardMedia,
  Grid,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../utils/api";

const FoodReceiver = () => {
  const [donations, setDonations] = useState([]);
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?._id || storedUser?.user?._id;
  const token = storedUser?.token;

  useEffect(() => {
    fetchAvailableFood();
  }, []);

  const fetchAvailableFood = async () => {
    try {
      const response = await api.get("/food-donations/available");
      setDonations(response.data);
    } catch (error) {
      console.error("Error fetching food donations:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this donation?")) {
      try {
        await api.delete(`/food-donations/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchAvailableFood();
      } catch (error) {
        console.error("Error deleting donation:", error.response?.data || error.message);
        alert("Error deleting the donation. Please try again.");
      }
    }
  };

  const claimFood = async (foodId) => {
    try {
      console.log("🔑 User Token:", token);
      if (!token) {
        console.error("❌ No token found in frontend.");
        return;
      }

      await api.put(
        `/food-donations/claim/${foodId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchAvailableFood(); // Refresh list after claiming
    } catch (error) {
      console.error("❌ Error claiming food:", error.response?.data || error.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Available Food Donations
      </Typography>
      {donations.length === 0 ? (
        <Typography>No available donations at the moment.</Typography>
      ) : (
        <Grid container spacing={3}>
          {donations.map((donation) => {
            // Debug logs
            console.log("🔍 Donation:", donation);
            console.log("🔑 donation.donorId:", donation.donorId);
            console.log("👤 Current userId:", userId);

            const donorIdStr =
              donation.donorId?._id?.toString() || donation.donorId?.toString();
            const isOwner = donorIdStr === userId;

            return (
              <Grid item xs={12} sm={6} md={4} key={donation._id}>
                <Card
                  sx={{ p: 2, maxWidth: "100%", height: "100%", position: "relative" }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={donation.foodImage}
                    alt={donation.itemName}
                    sx={{ objectFit: "cover" }}
                  />
                  <CardContent>
                    <Typography variant="h6">{donation.itemName}</Typography>
                    <Typography>
                      <strong>Donor Name:</strong> {donation.fullName}
                    </Typography>
                    <Typography>
                      <strong>Contact:</strong> {donation.contactNumber}
                    </Typography>
                    <Typography>
                      <strong>Food Type:</strong> {donation.foodType}
                    </Typography>
                    <Typography>
                      <strong>Weight:</strong> {donation.weight}
                    </Typography>
                    <Typography>
                      <strong>Cooking Date:</strong>{" "}
                      {new Date(donation.cookingDate).toLocaleDateString()}
                    </Typography>
                    <Typography>
                      <strong>Expiry Date:</strong>{" "}
                      {new Date(donation.expiryDate).toLocaleDateString()}
                    </Typography>
                    <Typography>
                      <strong>Storage Instructions:</strong>{" "}
                      {donation.storageInstructions}
                    </Typography>
                    <Typography>
                      <strong>Pickup Address:</strong> {donation.pickupAddress}
                    </Typography>

                    {donation.status === "claimed" ? (
                      <Button variant="contained" color="secondary" disabled>
                        Already Claimed
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => claimFood(donation._id)}
                      >
                        Claim Food
                      </Button>
                    )}
                  </CardContent>

                  {/* Delete Button (Only Visible to Donor) */}
                  {isOwner && (
                    <IconButton
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete(donation._id);
                      }}
                      sx={{
                        position: "absolute",
                        bottom: 10,
                        right: 10,
                        color: "red",
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </div>
  );
};

export default FoodReceiver;

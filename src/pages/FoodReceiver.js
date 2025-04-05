import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  CardMedia,
  Grid,
  IconButton,
  Button,
  Backdrop,
  Snackbar,
  Slide,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { OrbitProgress } from "react-loading-indicators";
import api from "../utils/api";

function SlideUpTransition(props) {
  return <Slide {...props} direction="up" />;
}

const FoodReceiver = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
  });

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?._id || storedUser?.user?._id;
  const token = storedUser?.token;

  useEffect(() => {
    fetchAvailableFood();
  }, []);

  const fetchAvailableFood = async () => {
    setLoading(true);
    try {
      const response = await api.get("/food-donations/available");
      setDonations(response.data);
    } catch (error) {
      console.error("Error fetching food donations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this donation?")) {
      setLoading(true);
      try {
        await api.delete(`/food-donations/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchAvailableFood();
      } catch (error) {
        console.error("Error deleting donation:", error.response?.data || error.message);
        setSnackbar({
          open: true,
          message: "Error deleting the donation. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const claimFood = async (donation) => {
    const donorIdStr =
      donation.donorId?._id?.toString() || donation.donorId?.toString();
    if (donorIdStr === userId) {
      setSnackbar({
        open: true,
        message: "❌ Self-claiming your own food is not allowed.",
      });
      return;
    }

    setLoading(true);
    try {
      await api.put(
        `/food-donations/claim/${donation._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchAvailableFood();
    } catch (error) {
      console.error("❌ Error claiming food:", error.response?.data || error.message);
      setSnackbar({
        open: true,
        message: "Error claiming food. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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
                    <Typography><strong>Donor Name:</strong> {donation.fullName}</Typography>
                    <Typography><strong>Contact:</strong> {donation.contactNumber}</Typography>
                    <Typography><strong>Food Type:</strong> {donation.foodType}</Typography>
                    <Typography><strong>Weight:</strong> {donation.weight}</Typography>
                    <Typography><strong>Cooking Date:</strong> {new Date(donation.cookingDate).toLocaleDateString()}</Typography>
                    <Typography><strong>Expiry Date:</strong> {new Date(donation.expiryDate).toLocaleDateString()}</Typography>
                    <Typography><strong>Storage Instructions:</strong> {donation.storageInstructions}</Typography>
                    <Typography><strong>Pickup Address:</strong> {donation.pickupAddress}</Typography>

                    {donation.status === "claimed" ? (
                      <Button variant="contained" color="secondary" disabled>
                        Already Claimed
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => claimFood(donation)}
                      >
                        Claim Food
                      </Button>
                    )}
                  </CardContent>

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

      {/* Full-screen Loader */}
      <Backdrop open={loading} sx={{ zIndex: 9999, color: "#fff", flexDirection: "column" }}>
        <OrbitProgress color={["#3160cc", "#cc31ad", "#cc9d31", "#31cc4f"]} size={100} />
        <Typography mt={2}>Loading...</Typography>
      </Backdrop>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        onClose={handleCloseSnackbar}
        autoHideDuration={3000}
        message={snackbar.message}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        TransitionComponent={SlideUpTransition}
      />
    </div>
  );
};

export default FoodReceiver;

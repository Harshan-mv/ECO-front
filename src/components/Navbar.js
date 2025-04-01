import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Ecovision
        </Typography>
        <Box>
        <Button color="inherit" component={Link} to="/dashboard">
            Dashboard
          </Button>
        <Button color="inherit" component={Link} to="/food-receiver">
            Food Reciver
          </Button>
          <Button color="inherit" component={Link} to="/food-donation">
            Food Donation
          </Button>
          <Button color="inherit" component={Link} to="/green-score">
            Green Score
          </Button>
          <Button color="inherit" component={Link} to="/blogs">
            Blog
          </Button>
          <Button color="inherit" component={Link} to="/">
            Log Out
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

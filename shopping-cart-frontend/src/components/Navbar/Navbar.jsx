import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import logo from "../../Images/logo.png";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

function Navbar() {
  return (
    <AppBar sx={{backgroundColor: '#FBB500'}} position="fixed">
      <Toolbar variant="dense">
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <img
          src={logo}
          alt="Logo"
          width={60}
          height={52}
        />
        <Typography
              variant="h6"
              noWrap
              fontWeight="bold"
              component="div"
              sx={{ display: { xs: 'none', sm: 'block' }, paddingRight: 1 }}
            >
              Thunder Foods
            </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-haspopup="true"
                color="inherit"
              >
                <ShoppingCartOutlinedIcon />
              </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
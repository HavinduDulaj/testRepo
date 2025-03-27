import React, { useState } from 'react';
import { Box, Typography, IconButton, Menu, MenuItem, Avatar } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { Link, useNavigate } from 'react-router-dom'; // Import Link
import './guest_header.css';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [firstName, setFirstName] = useState('Admin'); // Default to Admin
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // Handle profile icon click
  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle menu close
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Handle "Edit Profile" click
  const handleEditProfile = () => {
    handleClose();
    navigate('/edit-profile'); // Navigate to the edit profile page
  };

  // Handle "Logout" click
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    setFirstName('Admin'); // Reset to default
    handleClose();
    navigate('/login'); // Navigate to the login page
  };

  return (
    <Box className="header-container">
      <Box className="guest_header">
        <Box className="contact-section">
          <Typography variant="body1">
            Call Now: <br />
            0717901354 / 0703399599
          </Typography>
        </Box>

        <Box className="logo-section">
          {/* Wrap the logo in a Link component */}
          <Link to="/" style={{ textDecoration: 'none' }}>
            <img
              src="https://intercambioeviagem.com.br/wp-content/uploads/2016/08/TravelMate-Logo.png"
              alt="Logo"
              className="logo"
            />
          </Link>
        </Box>

        <Box className="icon-section">
          <IconButton color="inherit">
            <SearchIcon />
          </IconButton>

          {/* User Profile Section */}
          {token ? (
            <>
              <Typography variant="body1" style={{ marginLeft: '8px', color: '#fff' }}>
                Hi, {localStorage.getItem('username') || firstName}
              </Typography>
              <IconButton color="inherit" onClick={handleProfileClick}>
                <Avatar
                  src="https://www.w3schools.com/howto/img_avatar.png"
                  alt="User Avatar"
                  style={{ width: 40, height: 40 }}
                />
              </IconButton>
            </>
          ) : (
            <>
              <Typography variant="body1" style={{ marginLeft: '8px', color: '#fff' }}>
                Hi, User
              </Typography>
              <IconButton color="inherit" onClick={handleProfileClick}>
                <Avatar
                  src="https://www.w3schools.com/howto/img_avatar.png"
                  alt="Guest Avatar"
                  style={{ width: 40, height: 40 }}
                />
              </IconButton>
            </>
          )}

          {/* Profile Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom', // Anchor at the bottom of the icon
              horizontal: 'right', // Align to the right of the icon
            }}
            transformOrigin={{
              vertical: 'top', // Start the menu from the top
              horizontal: 'right', // Align to the right
            }}
            getContentAnchorEl={null} // Prevents Material-UI from overriding the anchor position
          >
            {token ? (
              <>
                <MenuItem onClick={handleEditProfile}>Edit Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </>
            ) : (
              <MenuItem onClick={() => navigate('/login')}>Login</MenuItem>
            )}
          </Menu>
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
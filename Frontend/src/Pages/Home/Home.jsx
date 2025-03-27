import React from 'react';
import { Box, Typography, Button, Link } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import Header from '../../Components/navbar';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1500835556837-99ac94a94552?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <Box
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: 8,
          boxShadow: '0px 0px 15px rgba(0,0,0,0.2)',
          width: '100%',
          maxWidth: '600px',
          padding: '30px',
          textAlign: 'center'
        }}
      >
        {/* Title Section */}
        <Typography 
          variant="h3" 
          gutterBottom 
          style={{
            fontFamily: 'cursive',
            fontWeight: 'bold',
            color: 'purple',
            marginBottom: '20px'
          }}
        >
          Welcome to TravelMate
        </Typography>

        {/* Description Section */}
        <Typography 
          variant="body1" 
          style={{
            fontSize: '1.1rem',
            color: '#555',
            marginBottom: '30px'
          }}
        >
          Your ultimate travel companion for planning and managing your trips. Explore new destinations, book accommodations, and create unforgettable memories.
        </Typography>

        {/* Action Buttons */}
        <Box
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            marginTop: '20px'
          }}
        >
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={() => navigate('/register')}
          >
            Register
          </Button>
        </Box>

        {/* Additional Links */}
        <Box mt={4}>
          <Typography variant="body2" style={{ color: '#777' }}>
            Learn more about{' '}
            <Link href="/about" style={{ fontWeight: 'bold', color: 'purple' }}>
              TravelMate
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
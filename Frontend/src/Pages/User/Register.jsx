import React, { useState, useEffect } from 'react';
import {
  TextField, Button, MenuItem, FormControl, Select, InputLabel, Box,
  Typography, FormHelperText, Grid, RadioGroup, FormControlLabel, Radio,
  IconButton, Chip, List, ListItem, Paper, Divider, Link
} from '@material-ui/core';
import Header from '../../Components/navbar';
import axios from 'axios';
import swal from 'sweetalert';

const UserRegistration = () => {
  // State variables for form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [userId, setUserId] = useState('');

  // Function to generate user ID
  const generateUserId = () => {
    // Generate a random 8-digit number
    const randomNum = Math.floor(10000000 + Math.random() * 90000000);
    // Create user ID with USR prefix followed by 8 digits
    return `USR${randomNum}`;
  };

  // Generate user ID on component mount
  useEffect(() => {
    const newUserId = generateUserId();
    setUserId(newUserId);
  }, []);

  // Calculate minimum date (18 years ago from today)
  const today = new Date();
  const minDate = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
  ).toISOString().split('T')[0]; // Format as YYYY-MM-DD

  // Effect to check if all required fields are filled
  useEffect(() => {
    const requiredFields = {
      fullName,
      email,
      contact,
      address,
      dob,
      gender,
      password,
      confirmPassword
    };

    // Check if all required fields have values
    const valid = Object.values(requiredFields).every(field => field !== '' && field !== null);

    // Check if passwords match
    const passwordsMatch = password === confirmPassword;

    setIsFormValid(valid && passwordsMatch);
  }, [fullName, email, contact, address, dob, gender, password, confirmPassword]);

  // Validate contact number (10 digits)
  const validateContact = (value) => {
    const contactRegex = /^\d{10}$/;
    return contactRegex.test(value);
  };

  // Validate email format
  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleContactChange = (e) => {
    const value = e.target.value;
    setContact(value);

    // Real-time validation for contact
    if (value && !validateContact(value)) {
      setErrors(prevErrors => ({
        ...prevErrors,
        contact: "Contact number must be 10 digits"
      }));
    } else {
      setErrors(prevErrors => ({ ...prevErrors, contact: '' }));
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    // Real-time validation for email
    if (value && !validateEmail(value)) {
      setErrors(prevErrors => ({
        ...prevErrors,
        email: "Invalid email format"
      }));
    } else {
      setErrors(prevErrors => ({ ...prevErrors, email: '' }));
    }
  };

  const handleGenderChange = (event) => {
    setGender(event.target.value);
    setErrors(prevErrors => ({ ...prevErrors, gender: '' }));
  };

  const handleDobChange = (e) => {
    setDob(e.target.value);
    setErrors(prevErrors => ({ ...prevErrors, dob: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!fullName) newErrors.fullName = "Full name is required.";
    if (!email) newErrors.email = "Email is required.";
    else if (!validateEmail(email)) newErrors.email = "Invalid email format.";
    if (!contact) newErrors.contact = "Contact number is required.";
    else if (!validateContact(contact)) newErrors.contact = "Contact number must be 10 digits.";
    if (!address) newErrors.address = "Address is required.";
    if (!dob) newErrors.dob = "Date of birth is required.";
    else {
      const birthDate = new Date(dob);
      const ageDate = new Date(today - birthDate);
      const age = Math.abs(ageDate.getUTCFullYear() - 1970);

      if (age < 18) {
        newErrors.dob = "User must be at least 18 years old.";
      }
    }
    if (!gender) newErrors.gender = "Gender is required.";
    if (!password) newErrors.password = "Password is required.";
    if (!confirmPassword) newErrors.confirmPassword = "Confirm password is required.";
    else if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match.";

    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Format date of birth for backend
    const formattedDOB = new Date(dob).toISOString();

    const newUser = {
      user_id: userId,
      full_name: fullName,
      email,
      contact,
      address,
      dob: formattedDOB,
      gender,
      password
    };

    try {
      // Create the user
      await axios.post('http://localhost:3001/user/register', newUser);

      swal("Success", "User registered successfully!", "success");

      // Reset form fields but keep the user ID
      setFullName('');
      setEmail('');
      setContact('');
      setAddress('');
      setDob('');
      setGender('');
      setPassword('');
      setConfirmPassword('');
      setErrors({});

      // Generate a new user ID for the next entry
      const newUserId = generateUserId();
      setUserId(newUserId);
    } catch (error) {
      console.error(error);

      // Check if it's a duplicate error (HTTP 409 Conflict)
      if (error.response && error.response.status === 409) {
        // Show the specific error message from the server
        swal("Error", error.response.data.message, "error");

        // Set appropriate field error based on the error message
        if (error.response.data.message.includes("contact")) {
          setErrors(prevErrors => ({
            ...prevErrors,
            contact: "This contact number is already registered"
          }));
        } else if (error.response.data.message.includes("email")) {
          setErrors(prevErrors => ({
            ...prevErrors,
            email: "This email is already registered"
          }));
        }
      } else {
        // Generic error message for other errors
        swal("Error", "Something went wrong. Please try again.", "error");
      }
    }
  };

  return (
    <Box
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)',
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
          maxWidth: '550px',
          padding: '30px',
          margin: '40px 0'
        }}
      >
        {/* Title Section */}
        <Typography 
          variant="h4" 
          gutterBottom 
          style={{
            fontFamily: 'cursive',
            fontWeight: 'bold',
            color: 'purple',
            textAlign: 'center',
            marginBottom: '30px'
          }}
        >
          Register for TravelMate
        </Typography>

        {/* Form Section */}
        <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
          {/* User ID field (read-only) with gray styling */}
          <TextField
            fullWidth
            margin="normal"
            label="User ID"
            variant="outlined"
            value={userId}
            InputProps={{
              readOnly: true,
              style: {
                backgroundColor: '#f0f0f0', // Light gray background
                color: '#757575',           // Darker gray text
                cursor: 'not-allowed',      // Change cursor to indicate it's not editable
              },
            }}
            helperText="System generated ID (cannot be modified)"
          />

          <TextField
            fullWidth
            margin="normal"
            label="Full Name"
            variant="outlined"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            helperText={errors.fullName}
            error={!!errors.fullName}
            required
          />

          <TextField
            fullWidth
            margin="normal"
            label="Email"
            variant="outlined"
            value={email}
            onChange={handleEmailChange}
            helperText={errors.email}
            error={!!errors.email}
            required
          />

          <TextField
            fullWidth
            margin="normal"
            label="Contact Number"
            variant="outlined"
            value={contact}
            onChange={handleContactChange}
            helperText={errors.contact}
            error={!!errors.contact}
            required
          />

          <TextField
            fullWidth
            margin="normal"
            label="Address"
            variant="outlined"
            multiline
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            helperText={errors.address}
            error={!!errors.address}
            required
          />

          {/* Native HTML date input instead of Material-UI DatePicker */}
          <TextField
            fullWidth
            margin="normal"
            label="Date of Birth"
            type="date"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            value={dob}
            onChange={handleDobChange}
            inputProps={{ max: minDate }}
            helperText={errors.dob || "Must be at least 18 years old"}
            error={!!errors.dob}
            required
          />

          <FormControl component="fieldset" margin="normal" error={!!errors.gender} required fullWidth>
            <Typography variant="subtitle1">Gender</Typography>
            <RadioGroup
              aria-label="gender"
              name="gender"
              value={gender}
              onChange={handleGenderChange}
              row
            >
              <FormControlLabel value="Male" control={<Radio />} label="Male" />
              <FormControlLabel value="Female" control={<Radio />} label="Female" />
            </RadioGroup>
            <FormHelperText>{errors.gender}</FormHelperText>
          </FormControl>

          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            helperText={errors.password}
            error={!!errors.password}
            required
          />

          <TextField
            fullWidth
            margin="normal"
            label="Confirm Password"
            type="password"
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            helperText={errors.confirmPassword}
            error={!!errors.confirmPassword}
            required
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            type="submit"
            style={{ marginTop: 25 }}
            disabled={!isFormValid}
          >
            Register User
          </Button>
          
          {/* Login link */}
          <Box mt={4} textAlign="center">
            <Typography variant="body1">
              Already have an account?{' '}
              <Link href="/login" style={{ fontWeight: 'bold' }}>
                Login here
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UserRegistration;
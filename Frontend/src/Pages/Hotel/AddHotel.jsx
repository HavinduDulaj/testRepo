import React, { useState, useEffect } from 'react';
import { 
  TextField, Button, MenuItem, FormControl, Select, InputLabel, Box, Typography, 
  FormHelperText, Grid, Divider, IconButton, Card, CardContent, Chip
} from '@material-ui/core';
import { Add, Delete, AddPhotoAlternate, Star, StarBorder } from '@material-ui/icons';
import Sidebar from '../../Components/sidebar';
import Header from '../../Components/navbar'; 
import axios from 'axios';
import swal from 'sweetalert';

const AddHotel = () => {
  // Main hotel details
  const [hotelId, setHotelId] = useState('');
  const [hotelName, setHotelName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [starRating, setStarRating] = useState('');
  const [description, setDescription] = useState('');
  const [hotelImage, setHotelImage] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [useImageUrl, setUseImageUrl] = useState(true);
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  // Package details
  const [packages, setPackages] = useState([]);
  const [currentPackage, setCurrentPackage] = useState({
    package_name: '',
    package_description: '',
    price: '',
    inclusions: [],
    validity_period: new Date(new Date().setMonth(new Date().getMonth() + 3))
  });
  const [inclusion, setInclusion] = useState('');
  const [packageErrors, setPackageErrors] = useState({});

  // Effect to check if all required fields are filled
  useEffect(() => {
    const requiredFields = {
      hotelId,
      hotelName,
      address,
      city,
      phoneNumber,
      email,
      website,
      starRating,
      description,
    };
    
    // Check if all required fields have values and at least one of the image options is valid
    const imageValid = useImageUrl ? hotelImage !== '' : uploadedImage !== null;
    const valid = Object.values(requiredFields).every(field => field !== '') && imageValid;
    setIsFormValid(valid);
  }, [hotelId, hotelName, address, city, phoneNumber, email, website, starRating, description, hotelImage, uploadedImage, useImageUrl]);

// Update the handler to accept either an event object or a direct value
const handleStarRatingChange = (eventOrValue) => {
  // If it's an event object with target.value, use that
  if (eventOrValue && eventOrValue.target && eventOrValue.target.value !== undefined) {
    setStarRating(eventOrValue.target.value);
  } 
  // Otherwise assume it's a direct rating value
  else {
    setStarRating(eventOrValue);
  }
  
  setErrors(prevErrors => ({ ...prevErrors, starRating: '' }));
};

const handleImageUpload = async (event) => {
  const file = event.target.files[0];
  if (file) {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('http://localhost:3001/hotel/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setUploadedImage(file);
      setHotelImage(response.data.imageUrl);
      setUseImageUrl(false);
    } catch (error) {
      console.error('Error uploading image:', error);
      swal("Error", "Failed to upload image. Please try again.", "error");
    }
  }
};

  const toggleImageSource = () => {
    setUseImageUrl(!useImageUrl);
    if (useImageUrl) {
      setHotelImage('');
    } else {
      setUploadedImage(null);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!hotelId) newErrors.hotelId = "Hotel ID is required.";
    if (!hotelName) newErrors.hotelName = "Hotel Name is required.";
    if (!address) newErrors.address = "Address is required.";
    if (!city) newErrors.city = "City is required.";
    if (!phoneNumber) newErrors.phoneNumber = "Phone Number is required.";
    if (!email) newErrors.email = "Email is required.";
    if (!validateEmail(email)) newErrors.email = "Invalid email format.";
    if (!website) newErrors.website = "Website is required.";
    if (!validateWebsite(website)) newErrors.website = "Invalid website URL format.";
    if (!starRating) newErrors.starRating = "Star Rating is required.";
    if (!description) newErrors.description = "Description is required.";
    
    if (useImageUrl && !hotelImage) {
      newErrors.hotelImage = "Hotel Image URL is required.";
    } else if (!useImageUrl && !uploadedImage) {
      newErrors.hotelImage = "Please upload an image.";
    }
    
    return newErrors;
  };

  // Email validation
  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase()) || email === '';
  };

  // Website validation
  const validateWebsite = (website) => {
    const re = /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
    return re.test(String(website).toLowerCase()) || website === '';
  };

  const validatePackage = () => {
    const newErrors = {};
    if (!currentPackage.package_name) newErrors.package_name = "Package name is required.";
    if (!currentPackage.package_description) newErrors.package_description = "Package description is required.";
    if (!currentPackage.price) newErrors.price = "Price is required.";
    if (isNaN(currentPackage.price)) newErrors.price = "Price must be a number.";
    if (currentPackage.inclusions.length === 0) newErrors.inclusions = "At least one inclusion is required.";
    
    if (!currentPackage.validity_period) {
      newErrors.validity_period = "Valid date is required.";
    } else {
      try {
        const date = new Date(currentPackage.validity_period);
        if (isNaN(date.getTime())) {
          newErrors.validity_period = "Invalid date format.";
        }
      } catch (error) {
        newErrors.validity_period = "Invalid date format.";
      }
    }
    
    return newErrors;
  };

  const handleAddInclusion = () => {
    if (inclusion.trim()) {
      setCurrentPackage({
        ...currentPackage,
        inclusions: [...currentPackage.inclusions, inclusion.trim()]
      });
      setInclusion('');
      if (packageErrors.inclusions) {
        setPackageErrors(prev => ({ ...prev, inclusions: '' }));
      }
    }
  };

  const handleRemoveInclusion = (index) => {
    const updatedInclusions = [...currentPackage.inclusions];
    updatedInclusions.splice(index, 1);
    setCurrentPackage({
      ...currentPackage,
      inclusions: updatedInclusions
    });
  };

  const handleAddPackage = () => {
    // Ensure validity_period is a valid date
    let updatedPackage = { ...currentPackage };
    
    if (!updatedPackage.validity_period) {
      updatedPackage.validity_period = new Date(new Date().setMonth(new Date().getMonth() + 3));
    }
    
    setCurrentPackage(updatedPackage);
    
    const validationErrors = validatePackage();
    if (Object.keys(validationErrors).length > 0) {
      setPackageErrors(validationErrors);
      return;
    }
    
    // Add the new package to the packages array
    setPackages([...packages, { ...updatedPackage }]);
    
    // Reset the current package form
    setCurrentPackage({
      package_name: '',
      package_description: '',
      price: '',
      inclusions: [],
      validity_period: new Date(new Date().setMonth(new Date().getMonth() + 3))
    });
    setPackageErrors({});
  };

  const handleRemovePackage = (index) => {
    const updatedPackages = [...packages];
    updatedPackages.splice(index, 1);
    setPackages(updatedPackages);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    try {
      let imageUrl = hotelImage;
      
      // If image is uploaded, send it to the server first
      if (!useImageUrl && uploadedImage) {
        const formData = new FormData();
        formData.append('image', uploadedImage);
        
        const uploadResponse = await axios.post('http://localhost:3001/hotel/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        imageUrl = uploadResponse.data.imageUrl;
      }
  
      // Prepare each package by formatting the date properly
      const formattedPackages = packages.map(pkg => ({
        ...pkg,
        // Ensure date is in ISO format
        validity_period: new Date(pkg.validity_period).toISOString()
      }));
  
      // Log the packages being sent
      console.log('Sending packages:', formattedPackages);
  
      const newHotel = {
        hotel_id: hotelId,
        hotel_name: hotelName,
        address,
        city,
        phone_number: phoneNumber,
        email,
        website,
        star_rating: Number(starRating),
        description,
        hotel_image: imageUrl,
        hotel_packages: formattedPackages, // Send the formatted packages
      };
  
      // Log the full payload for debugging
      console.log('Sending hotel data:', newHotel);
  
      const response = await axios.post('http://localhost:3001/hotel/add-hotel', newHotel);
      console.log('Response:', response.data);
      
      swal("Success", "New hotel added successfully!", "success");
      // Reset form fields
      setHotelId('');
      setHotelName('');
      setAddress('');
      setCity('');
      setPhoneNumber('');
      setEmail('');
      setWebsite('');
      setStarRating('');
      setDescription('');
      setHotelImage('');
      setUploadedImage(null);
      setPackages([]);
      setErrors({});
    } catch (error) {
      console.error('Error creating hotel:', error);
      
      // Check for specific error types
      if (error.response && error.response.status === 400) {
        swal("Error", error.response.data.message, "error");
        setErrors(prevErrors => ({ 
          ...prevErrors, 
          hotelId: "A hotel with this ID already exists" 
        }));
      } else if (error.response && error.response.data.error && error.response.data.error.includes('duplicate key')) {
        if (error.response.data.error.includes('email')) {
          setErrors(prevErrors => ({ ...prevErrors, email: "This email is already registered" }));
          swal("Error", "This email is already registered", "error");
        } else if (error.response.data.error.includes('phone_number')) {
          setErrors(prevErrors => ({ ...prevErrors, phoneNumber: "This phone number is already registered" }));
          swal("Error", "This phone number is already registered", "error");
        } else {
          swal("Error", "A duplicate value was detected", "error");
        }
      } else {
        swal("Error", "Something went wrong. Please try again.", "error");
      }
    }
  };

// The StarRatingComponent remains the same, now the handler will correctly process the ratingValue
const StarRatingComponent = () => {
  const totalStars = 5;
  
  return (
    <Box mt={2}>
      <Typography variant="body1" gutterBottom>Star Rating <span style={{ color: 'red' }}>*</span></Typography>
      <Box display="flex" alignItems="center">
        {[...Array(totalStars)].map((_, index) => {
          const ratingValue = index + 1;
          return (
            <IconButton 
              key={index}
              onClick={() => handleStarRatingChange(ratingValue)}
              style={{ padding: '4px' }}
            >
              {ratingValue <= starRating ? 
                <Star style={{ color: '#FFD700' }} fontSize="large" /> : 
                <StarBorder fontSize="large" />
              }
            </IconButton>
          );
        })}
      </Box>
      {errors.starRating && (
        <FormHelperText error>{errors.starRating}</FormHelperText>
      )}
    </Box>
  );
};

  // List of cities for the dropdown
  const popularCities = [
    "Colombo", "Kandy", "Galle", "Negombo", "Bentota", 
    "Nuwara Eliya", "Ella", "Mirissa", "Hikkaduwa", "Trincomalee", 
    "Anuradhapura", "Sigiriya", "Dambulla", "Jaffna", "Arugam Bay",
    "Batticaloa", "Tangalle", "Unawatuna", "Matara", "Habarana"
  ];

  return (
    <Box>
      <Box display="flex">
        <Sidebar />
        <Box
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={2}
          style={{ backgroundColor: 'white', borderRadius: 8, boxShadow: '0px 0px 10px rgba(0,0,0,0.1)', flex: 1, margin: '15px' }}
        >
          {/* Title Section */}
          <Box
            alignItems="center"
            justifyContent="center"
          >
            <Typography variant="h4" gutterBottom style={{ fontFamily: 'cursive', fontWeight: 'bold', color: 'purple', textAlign: 'center', marginTop:'30px', marginBottom:'50px' }}>
              Add New Hotel
            </Typography>
          </Box>

          <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Left side - Hotel Details */}
             {/* Left side - Hotel Details */}
             <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom style={{ color: '#555' }}>
                  Hotel Details
                </Typography>
                
                {/* Hotel Details Form Fields */}
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Hotel ID"
                      variant="outlined"
                      value={hotelId}
                      onChange={(e) => {
                        setHotelId(e.target.value);
                        if (errors.hotelId) {
                          setErrors(prevErrors => ({ ...prevErrors, hotelId: '' }));
                        }
                      }}
                      helperText={errors.hotelId}
                      error={!!errors.hotelId}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Hotel Name"
                      variant="outlined"
                      value={hotelName}
                      onChange={(e) => {
                        setHotelName(e.target.value);
                        if (errors.hotelName) {
                          setErrors(prevErrors => ({ ...prevErrors, hotelName: '' }));
                        }
                      }}
                      helperText={errors.hotelName}
                      error={!!errors.hotelName}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Address"
                      variant="outlined"
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        if (errors.address) {
                          setErrors(prevErrors => ({ ...prevErrors, address: '' }));
                        }
                      }}
                      helperText={errors.address}
                      error={!!errors.address}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth margin="normal" variant="outlined" error={!!errors.city} required>
                      <InputLabel>City</InputLabel>
                      <Select
                        value={city}
                        onChange={(e) => {
                          setCity(e.target.value);
                          if (errors.city) {
                            setErrors(prevErrors => ({ ...prevErrors, city: '' }));
                          }
                        }}
                        label="City"
                      >
                        {popularCities.map((city) => (
                          <MenuItem key={city} value={city}>
                            {city}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>{errors.city}</FormHelperText>
                    </FormControl>
                  </Grid>
                  
                  {/* Phone Number, Website, and Email in a single row */}
                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          margin="normal"
                          label="Phone Number"
                          variant="outlined"
                          value={phoneNumber}
                          onChange={(e) => {
                            setPhoneNumber(e.target.value);
                            if (errors.phoneNumber) {
                              setErrors(prevErrors => ({ ...prevErrors, phoneNumber: '' }));
                            }
                          }}
                          helperText={errors.phoneNumber}
                          error={!!errors.phoneNumber}
                          required
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          margin="normal"
                          label="Website"
                          variant="outlined"
                          value={website}
                          onChange={(e) => {
                            setWebsite(e.target.value);
                            if (errors.website) {
                              setErrors(prevErrors => ({ ...prevErrors, website: '' }));
                            }
                          }}
                          helperText={errors.website}
                          error={!!errors.website}
                          required
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          margin="normal"
                          label="Email"
                          variant="outlined"
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) {
                              setErrors(prevErrors => ({ ...prevErrors, email: '' }));
                            }
                          }}
                          helperText={errors.email}
                          error={!!errors.email}
                          required
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  
                  {/* Star Rating with Icons */}
                  <Grid item xs={12}>
                    <StarRatingComponent />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Description"
                      variant="outlined"
                      multiline
                      rows={4}
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                        if (errors.description) {
                          setErrors(prevErrors => ({ ...prevErrors, description: '' }));
                        }
                      }}
                      helperText={errors.description}
                      error={!!errors.description}
                      required
                    />
                  </Grid>
                </Grid>
                
                <Box mt={2}>
                  <Typography variant="body1" style={{ textAlign: 'left', marginBottom: '15px', color: '#666' }}>
                    <strong>Note:</strong> After adding the hotel, you can:
                  </Typography>
                  <Typography variant="body2" style={{ textAlign: 'left', color: '#666' }}>
                    • Add more packages to this hotel from the hotel details page<br />
                    • Edit hotel information<br />
                    • Manage packages and promotions<br />
                    • View hotel performance metrics
                  </Typography>
                </Box>
              </Grid>


              {/* Right side - Image Preview and Package Details */}
              <Grid item xs={12} md={6}>
                {/* Hotel Image Preview Section - Moved to right side */}
                <Typography variant="h6" gutterBottom style={{ color: '#555' }}>
                  Hotel Image
                </Typography>
                
                {/* Hotel Image Preview */}
                <Box
                  style={{
                    width: '100%',
                    height: '250px',
                    border: '1px dashed #ccc',
                    borderRadius: '10px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden',
                    marginBottom: '20px'
                  }}
                >
                  {hotelImage ? (
                    <img
                      src={hotelImage}
                      alt="Hotel Preview"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '10px',
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/600x400?text=Invalid+Image+URL";
                      }}
                    />
                  ) : (
                    <Typography variant="body1" color="textSecondary">
                      {useImageUrl ? 'Enter a valid image URL to see preview' : 'Upload an image to see preview'}
                    </Typography>
                  )}
                </Box>
                
                <FormControl fullWidth margin="normal" variant="outlined" error={!!errors.hotelImage}>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={toggleImageSource}
                    style={{ marginBottom: '10px' }}
                  >
                    {useImageUrl ? 'Switch to Image Upload' : 'Switch to Image URL'}
                  </Button>
                  
                  {useImageUrl ? (
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Hotel Image URL"
                      variant="outlined"
                      value={hotelImage}
                      onChange={(e) => {
                        setHotelImage(e.target.value);
                        if (errors.hotelImage) {
                          setErrors(prevErrors => ({ ...prevErrors, hotelImage: '' }));
                        }
                      }}
                      helperText={errors.hotelImage}
                      error={!!errors.hotelImage}
                      required
                    />
                  ) : (
                    <Box>
                      <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="contained-button-file"
                        multiple
                        type="file"
                        onChange={handleImageUpload}
                      />
                      <label htmlFor="contained-button-file">
                        <Button
                          variant="contained"
                          color="primary"
                          component="span"
                          startIcon={<AddPhotoAlternate />}
                          fullWidth
                        >
                          Upload Image
                        </Button>
                      </label>
                      {uploadedImage && (
                        <Typography variant="body2" style={{ marginTop: '8px' }}>
                          File: {uploadedImage.name}
                        </Typography>
                      )}
                      {errors.hotelImage && (
                        <FormHelperText error>{errors.hotelImage}</FormHelperText>
                      )}
                    </Box>
                  )}
                </FormControl>

                <Divider style={{ margin: '20px 0' }} />

                {/* Package Details Section */}
                <Typography variant="h6" gutterBottom style={{ color: '#555', marginTop: '20px' }}>
                  Add Package Details
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Package Name"
                      variant="outlined"
                      value={currentPackage.package_name}
                      onChange={(e) => {
                        setCurrentPackage({ ...currentPackage, package_name: e.target.value });
                        if (packageErrors.package_name) {
                          setPackageErrors(prev => ({ ...prev, package_name: '' }));
                        }
                      }}
                      error={!!packageErrors.package_name}
                      helperText={packageErrors.package_name}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Package Description"
                      variant="outlined"
                      multiline
                      rows={3}
                      value={currentPackage.package_description}
                      onChange={(e) => {
                        setCurrentPackage({ ...currentPackage, package_description: e.target.value });
                        if (packageErrors.package_description) {
                          setPackageErrors(prev => ({ ...prev, package_description: '' }));
                        }
                      }}
                      error={!!packageErrors.package_description}
                      helperText={packageErrors.package_description}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Price"
                      variant="outlined"
                      type="number"
                      value={currentPackage.price}
                      onChange={(e) => {
                        setCurrentPackage({ ...currentPackage, price: e.target.value });
                        if (packageErrors.price) {
                          setPackageErrors(prev => ({ ...prev, price: '' }));
                        }
                      }}
                      error={!!packageErrors.price}
                      helperText={packageErrors.price}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      margin="normal"
                      id="validity-period"
                      label="Validity Period"
                      type="date"
                      variant="outlined"
                      value={currentPackage.validity_period ? 
                        new Date(currentPackage.validity_period).toISOString().split('T')[0] : 
                        new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split('T')[0]}
                      onChange={(e) => {
                        const newDate = e.target.value ? new Date(e.target.value) : 
                          new Date(new Date().setMonth(new Date().getMonth() + 3));
                        setCurrentPackage({ ...currentPackage, validity_period: newDate });
                        if (packageErrors.validity_period) {
                          setPackageErrors(prev => ({ ...prev, validity_period: '' }));
                        }
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        min: new Date().toISOString().split('T')[0], // Set min date to today
                      }}
                      error={!!packageErrors.validity_period}
                      helperText={packageErrors.validity_period}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">Inclusions</Typography>
                    <Box display="flex" alignItems="center" mt={1}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Add inclusion (e.g., Free breakfast)"
                        value={inclusion}
                        onChange={(e) => setInclusion(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddInclusion();
                          }
                        }}
                      />
                      <IconButton color="primary" onClick={handleAddInclusion}>
                        <Add />
                      </IconButton>
                    </Box>
                    {packageErrors.inclusions && (
                      <FormHelperText error>{packageErrors.inclusions}</FormHelperText>
                    )}
                    <Box display="flex" flexWrap="wrap" mt={2}>
                      {currentPackage.inclusions.map((item, index) => (
                        <Chip
                          key={index}
                          label={item}
                          onDelete={() => handleRemoveInclusion(index)}
                          style={{ margin: '4px' }}
                        />
                      ))}
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAddPackage}
                      startIcon={<Add />}
                      fullWidth
                    >
                      Add Package
                    </Button>
                  </Grid>
                </Grid>
                
                <Divider style={{ margin: '20px 0' }} />
                
                <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
                  Added Packages
                </Typography>
                
                {packages.length === 0 ? (
                  <Typography variant="body2" color="textSecondary">
                    No packages added yet.
                  </Typography>
                ) : (
                  <Box sx={{ maxHeight: '400px', overflow: 'auto' }}>
                    {packages.map((pkg, index) => (
                      <Card variant="outlined" key={index} style={{ marginBottom: '10px' }}>
                        <CardContent>
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6">{pkg.package_name}</Typography>
                            <IconButton size="small" onClick={() => handleRemovePackage(index)}>
                              <Delete />
                            </IconButton>
                          </Box>
                          <Typography variant="body2" color="textSecondary">
                            Price: ${pkg.price}
                          </Typography>
                          <Typography variant="body2">
                            {pkg.package_description}
                          </Typography>
                          <Typography variant="body2" style={{ marginTop: '8px' }}>
                            Inclusions:
                          </Typography>
                          <Box display="flex" flexWrap="wrap" mt={1}>
                            {pkg.inclusions.map((item, i) => (
                              <Chip
                                key={i}
                                label={item}
                                size="small"
                                style={{ margin: '2px' }}
                              />
                            ))}
                          </Box>
                          <Typography variant="body2" style={{ marginTop: '8px' }}>
                            Valid until: {new Date(pkg.validity_period).toLocaleDateString()}
                          </Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}
              </Grid>
            </Grid>
            
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              type="submit"
              style={{ marginTop: 24 }}
              disabled={!isFormValid}
            >
              Add Hotel
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AddHotel;
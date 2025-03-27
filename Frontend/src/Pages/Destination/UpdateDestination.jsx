import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, FormControl, Select, InputLabel, Box, Typography, FormHelperText, Chip, IconButton, CircularProgress } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import Sidebar from '../../Components/destination_sidebar';
import Header from '../../Components/navbar';
import axios from 'axios';
import swal from 'sweetalert';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateDestination = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [destinationId, setDestinationId] = useState('');
  const [destinationName, setDestinationName] = useState('');
  const [destinationImage, setDestinationImage] = useState('');
  const [destinationRating, setDestinationRating] = useState('');
  const [destinationDescription, setDestinationDescription] = useState('');
  const [location, setLocation] = useState('');
  const [popularAttractions, setPopularAttractions] = useState([]);
  const [currentAttraction, setCurrentAttraction] = useState('');
  const [bestTimeToVisit, setBestTimeToVisit] = useState('');
  const [travelTips, setTravelTips] = useState('');
  const [accommodationOptions, setAccommodationOptions] = useState([]);
  const [currentAccommodation, setCurrentAccommodation] = useState('');
  const [activities, setActivities] = useState([]);
  const [currentActivity, setCurrentActivity] = useState('');
  const [climate, setClimate] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  // Climate options
  const climateOptions = [
    'Tropical',
    'Temperate',
    'Arid (Desert)',
    'Mediterranean',
    'Continental',
    'Polar',
    'Mountain',
  ];

  // Best time to visit options
  const timeOptions = [
    'Early Morning',
    'Morning',
    'Afternoon',
    'Evening',
    'Night'
  ];

  // Fetch destination data
  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/destination/destinations/${id}`);
        const destination = response.data.destination;
        
        setDestinationId(destination.destination_id || '');
        setDestinationName(destination.destination_name || '');
        setDestinationImage(destination.destination_image || '');
        setPreviewImage(destination.destination_image || '');
        setDestinationRating(destination.destination_rating || '');
        setDestinationDescription(destination.destination_description || '');
        setLocation(destination.location || '');
        setPopularAttractions(destination.popular_attractions || []);
        setBestTimeToVisit(destination.best_time_to_visit || '');
        setTravelTips(destination.travel_tips || '');
        setAccommodationOptions(destination.accommodation_options || []);
        setActivities(destination.activities || []);
        setClimate(destination.climate || '');
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching destination:', error);
        swal("Error", "Failed to load destination data", "error");
        setLoading(false);
      }
    };

    fetchDestination();
  }, [id]);

  // Effect to check if all required fields are filled
  useEffect(() => {
    const requiredFields = {
      destinationId,
      destinationName,
      destinationImage,
      destinationRating,
      destinationDescription,
      location,
      bestTimeToVisit,
      travelTips,
      climate,
    };
    
    // Check if all required fields have values and required arrays are not empty
    const valid = Object.values(requiredFields).every(field => field !== '') && 
                 popularAttractions.length > 0 && 
                 accommodationOptions.length > 0 && 
                 activities.length > 0;
    
    setIsFormValid(valid);
  }, [destinationId, destinationName, destinationImage, destinationRating, destinationDescription, 
      location, popularAttractions, bestTimeToVisit, travelTips, accommodationOptions, 
      activities, climate]);

  // Handle image URL input
  const handleImageUrlChange = (event) => {
    const url = event.target.value;
    setDestinationImage(url);
    setPreviewImage(url);
    setErrors(prevErrors => ({ ...prevErrors, destinationImage: '' }));
  };

  // Handle adding a new attraction
  const handleAddAttraction = () => {
    if (currentAttraction.trim() !== '') {
      setPopularAttractions([...popularAttractions, currentAttraction.trim()]);
      setCurrentAttraction('');
    }
  };

  // Handle removing an attraction
  const handleRemoveAttraction = (index) => {
    const newAttractions = [...popularAttractions];
    newAttractions.splice(index, 1);
    setPopularAttractions(newAttractions);
  };

  // Handle adding a new accommodation option
  const handleAddAccommodation = () => {
    if (currentAccommodation.trim() !== '') {
      setAccommodationOptions([...accommodationOptions, currentAccommodation.trim()]);
      setCurrentAccommodation('');
    }
  };

  // Handle removing an accommodation option
  const handleRemoveAccommodation = (index) => {
    const newOptions = [...accommodationOptions];
    newOptions.splice(index, 1);
    setAccommodationOptions(newOptions);
  };

  // Handle adding a new activity
  const handleAddActivity = () => {
    if (currentActivity.trim() !== '') {
      setActivities([...activities, currentActivity.trim()]);
      setCurrentActivity('');
    }
  };

  // Handle removing an activity
  const handleRemoveActivity = (index) => {
    const newActivities = [...activities];
    newActivities.splice(index, 1);
    setActivities(newActivities);
  };

  // Handle climate change
  const handleClimateChange = (event) => {
    setClimate(event.target.value);
    setErrors(prevErrors => ({ ...prevErrors, climate: '' }));
  };

  // Handle best time to visit change
  const handleBestTimeChange = (event) => {
    setBestTimeToVisit(event.target.value);
    setErrors(prevErrors => ({ ...prevErrors, bestTimeToVisit: '' }));
  };

  // Handle star rating change
  const handleStarRating = (rating) => {
    setDestinationRating(rating);
    setErrors(prevErrors => ({ ...prevErrors, destinationRating: '' }));
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!destinationId) newErrors.destinationId = "Destination ID is required.";
    if (!destinationName) newErrors.destinationName = "Destination Name is required.";
    if (!destinationImage) newErrors.destinationImage = "Destination Image URL is required.";
    if (!destinationRating) newErrors.destinationRating = "Destination Rating is required.";
    if (!destinationDescription) newErrors.destinationDescription = "Destination Description is required.";
    if (!location) newErrors.location = "Location is required.";
    if (popularAttractions.length === 0) newErrors.popularAttractions = "At least one popular attraction is required.";
    if (!bestTimeToVisit) newErrors.bestTimeToVisit = "Best Time to Visit is required.";
    if (!travelTips) newErrors.travelTips = "Travel Tips are required.";
    if (accommodationOptions.length === 0) newErrors.accommodationOptions = "At least one accommodation option is required.";
    if (activities.length === 0) newErrors.activities = "At least one activity is required.";
    if (!climate) newErrors.climate = "Climate is required.";
    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    try {
      setLoading(true);
      
      // Prepare the destination data
      const destinationData = {
        destination_id: destinationId,
        destination_name: destinationName,
        destination_image_url: destinationImage,
        destination_rating: destinationRating,
        destination_description: destinationDescription,
        location: location,
        popular_attractions: popularAttractions,
        best_time_to_visit: bestTimeToVisit,
        travel_tips: travelTips,
        accommodation_options: accommodationOptions,
        activities: activities,
        climate: climate
      };
      
      const response = await axios.put(`http://localhost:3001/destination/update-destination/${id}`, destinationData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      console.log('Server response:', response.data);
      
      setLoading(false);
      swal("Success", "Destination updated successfully!", "success");
      navigate('/view-destination'); // Redirect to destinations list page
      
    } catch (error) {
      setLoading(false);
      console.error(error);
      
      if (error.response && error.response.data) {
        swal("Error", error.response.data.message || "Something went wrong. Please try again.", "error");
      } else {
        swal("Error", "Something went wrong. Please try again.", "error");
      }
    }
  };

  // Handle cancel button
  const handleCancel = () => {
    navigate('/destinations');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

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
          <Box alignItems="center" justifyContent="center">
            <Typography variant="h4" gutterBottom style={{ fontFamily: 'cursive', fontWeight: 'bold', color: 'purple', textAlign: 'center', marginTop:'30px' }}>
              Update Destination
            </Typography>
          </Box>

          {/* Main form - Moved to top level and wraps all inputs */}
          <Box component="form" width="100%" noValidate autoComplete="off" onSubmit={handleSubmit}>
            <Box display="flex" width="100%" flexDirection={{ xs: 'column', md: 'row' }}>
              {/* Left Form Section */}
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                style={{ flex: 1, padding: '20px', margin: '15px' }}
              >
                <TextField
                  fullWidth
                  label="Destination ID"
                  variant="outlined"
                  value={destinationId}
                  onChange={(e) => {
                    setDestinationId(e.target.value);
                    if (errors.destinationId) {
                      setErrors(prevErrors => ({ ...prevErrors, destinationId: '' }));
                    }
                  }}
                  helperText={errors.destinationId}
                  error={!!errors.destinationId}
                  required
                  style={{marginTop:'20px'}}
                  disabled // Disable editing destination ID for updates
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Destination Name"
                  variant="outlined"
                  value={destinationName}
                  onChange={(e) => {
                    setDestinationName(e.target.value);
                    if (errors.destinationName) {
                      setErrors(prevErrors => ({ ...prevErrors, destinationName: '' }));
                    }
                  }}
                  helperText={errors.destinationName}
                  error={!!errors.destinationName}
                  required
                />

                <TextField
                  fullWidth
                  margin="normal"
                  label="Location"
                  variant="outlined"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    if (errors.location) {
                      setErrors(prevErrors => ({ ...prevErrors, location: '' }));
                    }
                  }}
                  helperText={errors.location}
                  error={!!errors.location}
                  required
                />

                <TextField
                  fullWidth
                  margin="normal"
                  label="Description"
                  variant="outlined"
                  multiline
                  rows={4}
                  value={destinationDescription}
                  onChange={(e) => {
                    setDestinationDescription(e.target.value);
                    if (errors.destinationDescription) {
                      setErrors(prevErrors => ({ ...prevErrors, destinationDescription: '' }));
                    }
                  }}
                  helperText={errors.destinationDescription}
                  error={!!errors.destinationDescription}
                  required
                />

                <Box mt={2} width="100%" alignItems="flex-start" justifyContent="flex-start">
                <Typography variant="subtitle1" align="left">Popular Attractions *</Typography>
                <Box display="flex" alignItems="center" width="100%">
                    <TextField
                    fullWidth
                    variant="outlined"
                    value={currentAttraction}
                    onChange={(e) => setCurrentAttraction(e.target.value)}
                    placeholder="Add attraction"
                    />
                    <IconButton color="primary" onClick={handleAddAttraction} type="button">
                    <AddIcon />
                    </IconButton>
                </Box>
                <Box display="flex" flexWrap="wrap" mt={1} justifyContent="flex-start">
                    {popularAttractions.map((attraction, index) => (
                    <Chip
                        key={index}
                        label={attraction}
                        onDelete={() => handleRemoveAttraction(index)}
                        color="primary"
                        variant="outlined"
                        style={{ margin: '4px' }}
                    />
                    ))}
                </Box>
                {errors.popularAttractions && (
                    <FormHelperText error>{errors.popularAttractions}</FormHelperText>
                )}
                </Box>
                
                {/* Best Time to Visit - Dropdown */}
                <FormControl fullWidth margin="normal" variant="outlined" error={!!errors.bestTimeToVisit} required>
                  <InputLabel>Best Time to Visit</InputLabel>
                  <Select
                    value={bestTimeToVisit}
                    onChange={handleBestTimeChange}
                    label="Best Time to Visit"
                  >
                    {timeOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors.bestTimeToVisit}</FormHelperText>
                </FormControl>

                {/* Travel Tips */}
                <TextField
                  fullWidth
                  margin="normal"
                  label="Travel Tips"
                  variant="outlined"
                  multiline
                  rows={4}
                  value={travelTips}
                  onChange={(e) => {
                    setTravelTips(e.target.value);
                    if (errors.travelTips) {
                      setErrors(prevErrors => ({ ...prevErrors, travelTips: '' }));
                    }
                  }}
                  helperText={errors.travelTips}
                  error={!!errors.travelTips}
                  required
                />
 
                <Box mt={2} width="100%" alignItems="flex-start" justifyContent="flex-start">
                <Typography variant="subtitle1" align="left">Rating *</Typography>
                <Box display="flex" alignItems="center" justifyContent="flex-start">
                    {[1, 2, 3, 4, 5].map((star) => (
                    <IconButton 
                        key={star}
                        onClick={() => handleStarRating(star)}
                        style={{ padding: '8px' }}
                        type="button"
                    >
                        {star <= destinationRating ? (
                        <StarIcon style={{ color: '#FFD700', fontSize: '32px' }} />
                        ) : (
                        <StarBorderIcon style={{ fontSize: '32px' }} />
                        )}
                    </IconButton>
                    ))}
                </Box>
                {errors.destinationRating && (
                    <FormHelperText error>{errors.destinationRating}</FormHelperText>
                )}
                </Box>
              </Box>

              {/* Right Side Section */}
              <Box
                style={{
                  flex: 1,
                  padding: '20px',
                  margin: '25px',
                  display: { xs: 'none', md: 'block' }
                }}
              >
                {/* Accommodation Options */}
                <Box>
                  <Typography variant="subtitle1">Accommodation Options *</Typography>
                  <Box display="flex" alignItems="center">
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={currentAccommodation}
                      onChange={(e) => setCurrentAccommodation(e.target.value)}
                      placeholder="Add accommodation option"
                      size="small"
                      style={{ marginRight: '8px' }}
                    />
                    <IconButton color="primary" onClick={handleAddAccommodation} type="button">
                      <AddIcon />
                    </IconButton>
                  </Box>
                  <Box display="flex" flexWrap="wrap" mt={1}>
                    {accommodationOptions.map((option, index) => (
                      <Chip
                        key={index}
                        label={option}
                        onDelete={() => handleRemoveAccommodation(index)}
                        color="primary"
                        variant="outlined"
                        style={{ margin: '4px' }}
                      />
                    ))}
                  </Box>
                  {errors.accommodationOptions && (
                    <FormHelperText error>{errors.accommodationOptions}</FormHelperText>
                  )}
                </Box>

                {/* Activities */}
                <Box mt={2}>
                  <Typography variant="subtitle1">Activities *</Typography>
                  <Box display="flex" alignItems="center">
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={currentActivity}
                      onChange={(e) => setCurrentActivity(e.target.value)}
                      placeholder="Add activity"
                      size="small"
                      style={{ marginRight: '8px' }}
                    />
                    <IconButton color="primary" onClick={handleAddActivity} type="button">
                      <AddIcon />
                    </IconButton>
                  </Box>
                  <Box display="flex" flexWrap="wrap" mt={1}>
                    {activities.map((activity, index) => (
                      <Chip
                        key={index}
                        label={activity}
                        onDelete={() => handleRemoveActivity(index)}
                        color="primary"
                        variant="outlined"
                        style={{ margin: '4px' }}
                      />
                    ))}
                  </Box>
                  {errors.activities && (
                    <FormHelperText error>{errors.activities}</FormHelperText>
                  )}
                </Box>

                {/* Climate */}
                <FormControl fullWidth margin="normal" variant="outlined" error={!!errors.climate} required>
                  <InputLabel>Climate</InputLabel>
                  <Select
                    value={climate}
                    onChange={handleClimateChange}
                    label="Climate"
                  >
                    {climateOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{errors.climate}</FormHelperText>
                </FormControl>

                {/* Image URL input */}
                <Box mt={2}>
                  <Typography variant="subtitle1">Destination Image URL *</Typography>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Image URL"
                    variant="outlined"
                    placeholder="Enter image URL"
                    value={destinationImage}
                    onChange={handleImageUrlChange}
                    error={!!errors.destinationImage}
                    helperText={errors.destinationImage}
                    required
                  />

                  {previewImage && (
                    <Box mt={2} mb={2} style={{ textAlign: 'left' }}>
                      <Typography variant="subtitle2" gutterBottom>Image Preview:</Typography>
                      <img 
                        src={previewImage} 
                        alt="Preview" 
                        style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '4px' }} 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/400x200?text=Invalid+Image+URL";
                          setErrors(prevErrors => ({ ...prevErrors, destinationImage: 'Invalid image URL' }));
                        }}
                      />
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
            
            {/* Action Buttons */}
            <Box display="flex" justifyContent="space-between" mt={3}>
              <Button
                variant="outlined"
                color="secondary"
                size="large"
                onClick={handleCancel}
                style={{ width: '48%' }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                size="large"
                type="submit"
                disabled={!isFormValid || loading}
                style={{ width: '48%' }}
              >
                {loading ? <CircularProgress size={24} /> : 'Update Destination'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UpdateDestination;
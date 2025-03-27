import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, MenuItem, FormControl, Select, InputLabel, TablePagination, Avatar, Chip, Tooltip, IconButton, Collapse } from '@material-ui/core';
import Swal from 'sweetalert2';
import Sidebar from '../../Components/destination_sidebar';
import Header from '../../Components/navbar';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';
import Rating from '@material-ui/lab/Rating';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

// Custom Pagination Component
const CustomPagination = ({ count, page, rowsPerPage, onPageChange }) => {
  return (
    <TablePagination
      component="div"
      count={count}
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={onPageChange}
      rowsPerPageOptions={[]} // Hide rows per page selector
      labelRowsPerPage="" // Hide rows per page label
    />
  );
};

const useStyles = makeStyles((theme) => ({
  searchField: {
    marginBottom: '20px',
    width: '300px',
    borderRadius: '25px',
    '& .MuiOutlinedInput-root': {
      borderRadius: '25px',
      padding: '5px 10px',
    },
    '& .MuiOutlinedInput-input': {
      padding: '8px 14px',
      fontSize: '14px',
    },
  },
  criteriaSelect: {
    marginRight: '45px',
    minWidth: '150px',
    marginBottom: '30px',
  },
  contentContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
    flex: 1,
    margin: '15px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: '80vh',
    maxWidth: '100%',
    overflowX: 'auto',
  },
  tableContainer: {
    width: '100%',
    overflowX: 'auto',
  },
  destinationImage: {
    width: 50,
    height: 50,
    borderRadius: '50%',
    objectFit: 'cover',
  },
  attractionChip: {
    margin: '2px',
    backgroundColor: '#e0f7fa',
  },
  accommodationChip: {
    margin: '2px',
    backgroundColor: '#e8f5e9',
  },
  activityChip: {
    margin: '2px',
    backgroundColor: '#fff3e0',
  },
  climateChip: {
    backgroundColor: '#d4ac0d',
    color: 'white',
    borderRadius: '12px',
    padding: '3px 8px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    display: 'inline-block',
  },
  collapsible: {
    padding: theme.spacing(2),
    backgroundColor: '#f9f9f9',
    borderRadius: '4px',
  },
  chipContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    maxWidth: '300px',
  }
}));

const ViewDestinations = () => {
  const classes = useStyles();
  const [destinationData, setDestinationData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("destination_id");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [expandedRow, setExpandedRow] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDestinationData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/destination/get-destinations');
        
        // Check if response.data exists and has the expected structure
        if (Array.isArray(response.data)) {
          setDestinationData(response.data);
        } else if (response.data && Array.isArray(response.data.destinations)) {
          // If the array is nested in a 'destinations' property
          setDestinationData(response.data.destinations);
        } else if (response.data && Array.isArray(response.data.data)) {
          // If the array is nested in a 'data' property
          setDestinationData(response.data.data);
        } else {
          // If nothing works, initialize as empty array
          console.error("Unexpected API response format:", response.data);
          setDestinationData([]);
        }
      } catch (error) {
        console.error("There was an error fetching the destination data!", error);
        // Show error message with SweetAlert
        Swal.fire({
          title: 'Error!',
          text: 'Failed to load destination data',
          icon: 'error',
          confirmButtonColor: '#d33',
        });
        // Initialize as empty array on error
        setDestinationData([]);
      }
    };
  
    fetchDestinationData();
  }, []);

  const handleUpdate = (destinationId) => {
    console.log(`Update destination with ID: ${destinationId}`);
    navigate(`/update-destination/${destinationId}`); // Navigate to the update page
  };

  const handleViewDetails = (destinationId) => {
    console.log(`View details for destination with ID: ${destinationId}`);
    navigate(`/destination-details/${destinationId}`); // Navigate to the details page
  };

  const handleDelete = async (id) => {
    // First confirm deletion with SweetAlert
    const confirmResult = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });
    
    if (confirmResult.isConfirmed) {
      try {
        // If no bookings, proceed with deletion
        await axios.delete(`http://localhost:3001/destination/delete-destination/${id}`);
        setDestinationData(destinationData.filter(destination => destination._id !== id));
        
        // Show success message
        Swal.fire({
          title: 'Deleted!',
          text: 'Destination has been deleted successfully.',
          icon: 'success',
          confirmButtonColor: '#3085d6',
        });
      } catch (error) {
        console.error("There was an error deleting the destination!", error);
        Swal.fire({
          title: 'Error!',
          text: 'Error deleting destination: ' + (error.response?.data?.message || error.message),
          icon: 'error',
          confirmButtonColor: '#d33',
        });
      }
    }
  };

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCriteriaChange = (event) => {
    setSearchCriteria(event.target.value);
    setSearchQuery(""); // Reset search query when criteria changes
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleExpandRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const filteredDestinations = destinationData.filter(destination => {
    if (!searchQuery) return true;
    
    // Handle special case for destination_rating which is a number
    if (searchCriteria === 'destination_rating') {
      return destination[searchCriteria] === parseInt(searchQuery);
    }
    
    // Handle special case for climate which is an enum
    if (searchCriteria === 'climate') {
      return destination[searchCriteria]?.toLowerCase() === searchQuery.toLowerCase();
    }
    
    // Handle arrays (popular_attractions, accommodation_options, activities)
    if (['popular_attractions', 'accommodation_options', 'activities'].includes(searchCriteria)) {
      const arrayField = destination[searchCriteria] || [];
      return arrayField.some(item => 
        item.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    const field = destination[searchCriteria]?.toString().toLowerCase();
    return field?.includes(searchQuery.toLowerCase());
  });

  const paginatedDestinations = filteredDestinations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Helper function to truncate long text
  const truncateText = (text, maxLength = 30) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <Box>
      <Box display="flex">
        <Sidebar />
        <Box className={classes.contentContainer}>
          <Box
            alignItems="center"
            justifyContent="space-between"
            marginTop={"60px"}
            width="100%"
            display="flex"
            flexDirection="row"
          >
            <Typography variant="h4" gutterBottom style={{ marginBottom: '20px', fontFamily: 'cursive', fontWeight: 'bold', color: 'purple', textAlign: 'center' }}>
              Destinations List
            </Typography>
            <Box display="flex" alignItems="center">
              <FormControl className={classes.criteriaSelect}>
                <InputLabel>Search By</InputLabel>
                <Select
                  value={searchCriteria}
                  onChange={handleCriteriaChange}
                  label="Search By"
                >
                  <MenuItem value="destination_id">Destination ID</MenuItem>
                  <MenuItem value="destination_name">Destination Name</MenuItem>
                  <MenuItem value="location">Location</MenuItem>
                  <MenuItem value="climate">Climate</MenuItem>
                  <MenuItem value="destination_rating">Rating</MenuItem>
                  <MenuItem value="destination_description">Description</MenuItem>
                  <MenuItem value="popular_attractions">Attractions</MenuItem>
                  <MenuItem value="best_time_to_visit">Best Time to Visit</MenuItem>
                  <MenuItem value="travel_tips">Travel Tips</MenuItem>
                  <MenuItem value="accommodation_options">Accommodations</MenuItem>
                  <MenuItem value="activities">Activities</MenuItem>
                </Select>
              </FormControl>
              <TextField
                variant="outlined"
                placeholder={`Search by ${searchCriteria}`}
                value={searchQuery}
                onChange={handleSearchQueryChange}
                className={classes.searchField}
              />
            </Box>
          </Box>
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: '#d4ac0d', color: 'white' }}>
                  <TableCell style={{ color: 'white' }}></TableCell>
                  <TableCell style={{ color: 'white' }}>Image</TableCell>
                  <TableCell style={{ color: 'white' }}>ID</TableCell>
                  <TableCell style={{ color: 'white' }}>Name</TableCell>
                  <TableCell style={{ color: 'white' }}>Location</TableCell>
                  <TableCell style={{ color: 'white' }}>Climate</TableCell>
                  <TableCell style={{ color: 'white' }}>Rating</TableCell>
                  <TableCell style={{ color: 'white' }}>Best Time</TableCell>
                  <TableCell style={{ color: 'white' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedDestinations.map((destination) => (
                  <React.Fragment key={destination._id}>
                    <TableRow>
                      <TableCell>
                        <IconButton 
                          size="small" 
                          onClick={() => handleExpandRow(destination._id)}
                        >
                          {expandedRow === destination._id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <Avatar 
                          src={destination.destination_image} 
                          alt={destination.destination_name}
                          className={classes.destinationImage}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/50?text=Destination";
                          }}
                        />
                      </TableCell>
                      <TableCell>{destination.destination_id}</TableCell>
                      <TableCell>{destination.destination_name}</TableCell>
                      <TableCell>{destination.location}</TableCell>
                      <TableCell>
                        <span className={classes.climateChip}>{destination.climate}</span>
                      </TableCell>
                      <TableCell>
                        <Rating 
                          value={destination.destination_rating} 
                          readOnly 
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{destination.best_time_to_visit}</TableCell>
                      <TableCell>
                        <Box display="flex" flexDirection="row" alignItems="center">
                            <IconButton
                            color="primary"
                            onClick={() => handleUpdate(destination._id)}
                            >
                            <EditIcon />
                            </IconButton>
                            <IconButton
                            color="secondary"
                            onClick={() => handleDelete(destination._id)}
                            >
                            <DeleteIcon />
                            </IconButton>
                        </Box>
                        </TableCell>
                    </TableRow>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}> {/* Light background for better contrast */}
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
                        <Collapse in={expandedRow === destination._id} timeout="auto" unmountOnExit>
                        <Box 
                            className={classes.collapsible} 
                            margin={2} 
                            padding={2} 
                            sx={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: 1 }}
                        >
                            <Box marginBottom={1.5}>
                            <Typography 
                                variant="body2" 
                                gutterBottom 
                                sx={{ fontWeight: 'bold', fontSize: '0.875rem', color: '#1976d2' }}
                            >
                                Description
                            </Typography>
                            <Typography variant="body2" sx={{ fontSize: '0.75rem', color: '#424242' }}>
                                {destination.destination_description}
                            </Typography>
                            </Box>

                            <Box marginBottom={1.5}>
                            <Typography 
                                variant="body2" 
                                gutterBottom 
                                sx={{ fontWeight: 'bold', fontSize: '0.875rem', color: '#1976d2' }}
                            >
                                Popular Attractions
                            </Typography>
                            <Box className={classes.chipContainer} sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {destination.popular_attractions?.map((attraction, index) => (
                                <Chip key={index} label={attraction} color="primary" variant="outlined" size="small" />
                                ))}
                            </Box>
                            </Box>

                            <Box marginBottom={1.5}>
                            <Typography 
                                variant="body2" 
                                gutterBottom 
                                sx={{ fontWeight: 'bold', fontSize: '0.875rem', color: '#1976d2' }}
                            >
                                Accommodation Options
                            </Typography>
                            <Box className={classes.chipContainer} sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {destination.accommodation_options?.map((accommodation, index) => (
                                <Chip key={index} label={accommodation} color="secondary" variant="outlined" size="small" />
                                ))}
                            </Box>
                            </Box>

                            <Box marginBottom={1.5}>
                            <Typography 
                                variant="body2" 
                                gutterBottom 
                                sx={{ fontWeight: 'bold', fontSize: '0.875rem', color: '#1976d2' }}
                            >
                                Activities
                            </Typography>
                            <Box className={classes.chipContainer} sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {destination.activities?.map((activity, index) => (
                                <Chip key={index} label={activity} color="success" variant="outlined" size="small" />
                                ))}
                            </Box>
                            </Box>

                            <Box marginBottom={1.5}>
                            <Typography 
                                variant="body2" 
                                gutterBottom 
                                sx={{ fontWeight: 'bold', fontSize: '0.875rem', color: '#1976d2' }}
                            >
                                Travel Tips
                            </Typography>
                            <Typography variant="body2" sx={{ fontSize: '0.75rem', color: '#424242' }}>
                                {destination.travel_tips}
                            </Typography>
                            </Box>
                        </Box>
                        </Collapse>
                    </TableCell>
                    </TableRow>

                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <CustomPagination
            count={filteredDestinations.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ViewDestinations;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Button, TextField, MenuItem, FormControl, Select, InputLabel, TablePagination, 
  Avatar, Chip, Tooltip, IconButton, Collapse 
} from '@material-ui/core';
import Swal from 'sweetalert2';
import Sidebar from '../../Components/sidebar';
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
  hotelImage: {
    width: 50,
    height: 50,
    borderRadius: '50%',
    objectFit: 'cover',
  },
  packageCount: {
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
  },
  packageChip: {
    margin: '2px',
    backgroundColor: '#e0f7fa',
  },
  inclusionChip: {
    margin: '2px',
    backgroundColor: '#e8f5e9',
  }
}));

const ViewHotels = () => {
  const classes = useStyles();
  const [hotelData, setHotelData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("hotel_id");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [expandedRow, setExpandedRow] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/hotel/get-hotels');
        
        // Check if response.data exists and has the expected structure
        if (Array.isArray(response.data)) {
          setHotelData(response.data);
        } else if (response.data && Array.isArray(response.data.hotels)) {
          // If the array is nested in a 'hotels' property
          setHotelData(response.data.hotels);
        } else if (response.data && Array.isArray(response.data.data)) {
          // If the array is nested in a 'data' property
          setHotelData(response.data.data);
        } else {
          // If nothing works, initialize as empty array
          console.error("Unexpected API response format:", response.data);
          setHotelData([]);
        }
      } catch (error) {
        console.error("There was an error fetching the hotel data!", error);
        // Show error message with SweetAlert
        Swal.fire({
          title: 'Error!',
          text: 'Failed to load hotel data',
          icon: 'error',
          confirmButtonColor: '#d33',
        });
        // Initialize as empty array on error
        setHotelData([]);
      }
    };
  
    fetchHotelData();
  }, []);

  const handleUpdate = (hotelId) => {
    console.log(`Update hotel with ID: ${hotelId}`);
    navigate(`/update-hotel/${hotelId}`); // Navigate to the update page with the hotel ID
  };

  const handleViewPackages = (hotelId) => {
    console.log(`View packages for hotel with ID: ${hotelId}`);
    navigate(`/hotel-packages/${hotelId}`); // Navigate to the hotel packages page
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
        await axios.delete(`http://localhost:3001/hotel/delete-hotel/${id}`);
        setHotelData(hotelData.filter(hotel => hotel._id !== id));
        
        // Show success message
        Swal.fire({
          title: 'Deleted!',
          text: 'Hotel has been deleted successfully.',
          icon: 'success',
          confirmButtonColor: '#3085d6',
        });
      } catch (error) {
        console.error("There was an error deleting the hotel!", error);
        Swal.fire({
          title: 'Error!',
          text: 'Error deleting hotel: ' + (error.response?.data?.message || error.message),
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

  const filteredHotels = hotelData.filter(hotel => {
    if (!searchQuery) return true;
    
    // Handle special case for star_rating which is a number
    if (searchCriteria === 'star_rating') {
      return hotel[searchCriteria] === parseInt(searchQuery);
    }
    
    // Handle searching in hotel_packages array if that's the criteria
    if (searchCriteria === 'hotel_packages') {
      const packages = hotel.hotel_packages || [];
      return packages.some(pkg => 
        pkg.package_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.package_description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    const field = hotel[searchCriteria]?.toString().toLowerCase();
    return field?.includes(searchQuery.toLowerCase());
  });

  const paginatedHotels = filteredHotels.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Format date to display in a readable format
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
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
              Hotels List
            </Typography>
            <Box display="flex" alignItems="center">
              <FormControl className={classes.criteriaSelect}>
                <InputLabel>Search By</InputLabel>
                <Select
                  value={searchCriteria}
                  onChange={handleCriteriaChange}
                  label="Search By"
                >
                  <MenuItem value="hotel_id">Hotel ID</MenuItem>
                  <MenuItem value="hotel_name">Hotel Name</MenuItem>
                  <MenuItem value="city">City</MenuItem>
                  <MenuItem value="address">Address</MenuItem>
                  <MenuItem value="phone_number">Phone Number</MenuItem>
                  <MenuItem value="email">Email</MenuItem>
                  <MenuItem value="website">Website</MenuItem>
                  <MenuItem value="star_rating">Star Rating</MenuItem>
                  <MenuItem value="description">Description</MenuItem>
                  <MenuItem value="hotel_packages">Packages</MenuItem>
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
                  <TableCell style={{ color: 'white' }}>Hotel ID</TableCell>
                  <TableCell style={{ color: 'white' }}>Hotel Name</TableCell>
                  <TableCell style={{ color: 'white' }}>City</TableCell>
                  <TableCell style={{ color: 'white' }}>Phone</TableCell>
                  <TableCell style={{ color: 'white' }}>Rating</TableCell>
                  <TableCell style={{ color: 'white' }}>Packages</TableCell>
                  <TableCell style={{ color: 'white' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedHotels.map((hotel) => (
                  <React.Fragment key={hotel._id}>
                    <TableRow>
                      <TableCell>
                        <IconButton 
                          size="small" 
                          onClick={() => handleExpandRow(hotel._id)}
                        >
                          {expandedRow === hotel._id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <Avatar 
                          src={hotel.hotel_image} 
                          alt={hotel.hotel_name}
                          className={classes.hotelImage}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/50?text=Hotel";
                          }}
                        />
                      </TableCell>
                      <TableCell>{hotel.hotel_id}</TableCell>
                      <TableCell>{hotel.hotel_name}</TableCell>
                      <TableCell>{hotel.city}</TableCell>
                      <TableCell>{hotel.phone_number}</TableCell>
                      <TableCell>
                        <Rating 
                          value={hotel.star_rating} 
                          readOnly 
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <span className={classes.packageCount}>
                          {hotel.hotel_packages?.length || 0}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" flexDirection="row" alignItems="center">
                          <IconButton
                            color="primary"
                            onClick={() => handleUpdate(hotel._id)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="secondary"
                            onClick={() => handleDelete(hotel._id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
                        <Collapse in={expandedRow === hotel._id} timeout="auto" unmountOnExit>
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
                                Contact Information
                              </Typography>
                              <Typography variant="body2" sx={{ fontSize: '0.75rem', color: '#424242' }}>
                                <strong>Address:</strong> {hotel.address}<br />
                                <strong>Email:</strong> {hotel.email}<br />
                                <strong>Phone:</strong> {hotel.phone_number}<br />
                                <strong>Website:</strong> <a href={hotel.website} target="_blank" rel="noopener noreferrer">{hotel.website}</a>
                              </Typography>
                            </Box>

                            <Box marginBottom={1.5}>
                              <Typography 
                                variant="body2" 
                                gutterBottom 
                                sx={{ fontWeight: 'bold', fontSize: '0.875rem', color: '#1976d2' }}
                              >
                                Description
                              </Typography>
                              <Typography variant="body2" sx={{ fontSize: '0.75rem', color: '#424242' }}>
                                {hotel.description}
                              </Typography>
                            </Box>

                            <Box marginBottom={1.5}>
                              <Typography 
                                variant="body2" 
                                gutterBottom 
                                sx={{ fontWeight: 'bold', fontSize: '0.875rem', color: '#1976d2' }}
                              >
                                Available Packages
                              </Typography>
                              {hotel.hotel_packages && hotel.hotel_packages.length > 0 ? (
                                hotel.hotel_packages.map((pkg, idx) => (
                                  <Box key={idx} marginBottom={1} padding={1} sx={{ backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                                    <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.8rem', color: '#1976d2' }}>
                                      {pkg.package_name} - ${pkg.price}
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontSize: '0.75rem', color: '#424242' }}>
                                      {pkg.package_description}
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontSize: '0.75rem', color: '#424242', marginTop: '4px' }}>
                                      <strong>Valid until:</strong> {formatDate(pkg.validity_period)}
                                    </Typography>
                                    <Box className={classes.chipContainer} sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, marginTop: '4px' }}>
                                      {pkg.inclusions?.map((inclusion, index) => (
                                        <Chip key={index} label={inclusion} color="primary" variant="outlined" size="small" className={classes.inclusionChip} />
                                      ))}
                                    </Box>
                                  </Box>
                                ))
                              ) : (
                                <Typography variant="body2" sx={{ fontSize: '0.75rem', color: '#424242' }}>
                                  No packages available for this hotel.
                                </Typography>
                              )}
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
            count={filteredHotels.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ViewHotels;
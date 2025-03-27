import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, MenuItem, FormControl, Select, InputLabel, TablePagination } from '@material-ui/core';
import Sidebar from '../../Components/sidebar';
import Header from '../../Components/navbar';
import { makeStyles } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

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
    minHeight: '80vh', // Ensures the container doesn't shrink too much
  },
  tableContainer: {
    width: '100%',
    overflowX: 'auto',
  },
}));

const ViewUser = () => {
  const classes = useStyles();
  const [userData, setUserData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("full_name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3001/user/users');
        console.log("Response data:", response.data); // Log to see the actual structure
        
        // Make sure userData is always an array
        if (Array.isArray(response.data)) {
          setUserData(response.data);
        } else if (response.data && Array.isArray(response.data.users)) {
          setUserData(response.data.users);
        } else if (response.data && typeof response.data === 'object') {
          // If it's an object, try to find an array property
          const possibleArrays = Object.values(response.data).filter(val => Array.isArray(val));
          if (possibleArrays.length > 0) {
            setUserData(possibleArrays[0]);
          } else {
            console.error("Could not find user array in response:", response.data);
            setUserData([]);
          }
        } else {
          console.error("Unexpected response format:", response.data);
          setUserData([]);
        }
      } catch (error) {
        console.error("There was an error fetching the user data!", error);
        setUserData([]); // Ensure userData is always an array even on error
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleUpdate = (userId) => {
    console.log(`Update user with ID: ${userId}`);
    navigate(`/update-user/${userId}`); // Navigate to the update page with the user ID
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:3001/user/delete-user/${id}`);
          setUserData(userData.filter(user => user._id !== id));
          Swal.fire("Deleted!", "The user record has been deleted.", "success");
        } catch (error) {
          console.error("There was an error deleting the user!", error);
          Swal.fire("Error", "There was a problem deleting the record.", "error");
        }
      }
    });
  };

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCriteriaChange = (event) => {
    setSearchCriteria(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Fix the filteredUsers logic
  const filteredUsers = Array.isArray(userData) 
    ? userData.filter(user => {
        if (!searchQuery) return true;
        const field = user[searchCriteria]?.toString().toLowerCase();
        return field?.startsWith(searchQuery.toLowerCase());
      })
    : [];

  const paginatedUsers = filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  
  // Log for debugging
  console.log("Filtered users:", filteredUsers);
  console.log("Paginated users:", paginatedUsers);

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
              Users
            </Typography>
            <Box display="flex" alignItems="center">
              <FormControl className={classes.criteriaSelect}>
                <InputLabel>Search By</InputLabel>
                <Select
                  value={searchCriteria}
                  onChange={handleCriteriaChange}
                  label="Search By"
                >
                  <MenuItem value="full_name">Full Name</MenuItem>
                  <MenuItem value="email">Email</MenuItem>
                  <MenuItem value="contact">Contact</MenuItem>
                  <MenuItem value="address">Address</MenuItem>
                  <MenuItem value="gender">Gender</MenuItem>
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
          
          {loading ? (
            <Typography variant="h6">Loading users...</Typography>
          ) : filteredUsers.length > 0 ? (
            <TableContainer component={Paper} className={classes.tableContainer}>
              <Table>
                <TableHead>
                  <TableRow style={{ backgroundColor: '#d4ac0d', color: 'white' }}>
                    <TableCell style={{ color: 'white' }}>Full Name</TableCell>
                    <TableCell style={{ color: 'white' }}>Email</TableCell>
                    <TableCell style={{ color: 'white' }}>Contact</TableCell>
                    <TableCell style={{ color: 'white' }}>Address</TableCell>
                    <TableCell style={{ color: 'white' }}>Date of Birth</TableCell>
                    <TableCell style={{ color: 'white' }}>Gender</TableCell>
                    <TableCell style={{ color: 'white' }}>Update</TableCell>
                    <TableCell style={{ color: 'white' }}>Delete</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedUsers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>{user.full_name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.contact}</TableCell>
                      <TableCell>{user.address}</TableCell>
                      <TableCell>{user.dob ? new Date(user.dob).toLocaleDateString() : ''}</TableCell>
                      <TableCell>{user.gender}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleUpdate(user._id)}
                        >
                          Update
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          onClick={() => handleDelete(user._id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="h6">No users found</Typography>
          )}
          
          {filteredUsers.length > 0 && (
            <CustomPagination
              count={filteredUsers.length}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ViewUser;
import React, { useEffect, useState, useRef } from 'react';
import Sidebar from '../../Components/destination_sidebar';
import Header from '../../Components/navbar';
import axios from 'axios';
import html2canvas from 'html2canvas';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Avatar
} from '@material-ui/core';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import letterheadImage from '../../Images/letterhead.png'; 
import Rating from '@material-ui/lab/Rating';

const DestinationReportPage = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const reportRef = useRef(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await axios.get('http://localhost:3001/destination/get-destinations');
        
        if (Array.isArray(response.data)) {
          setDestinations(response.data);
        } else if (response.data && Array.isArray(response.data.destinations)) {
          setDestinations(response.data.destinations);
        } else if (response.data && Array.isArray(response.data.data)) {
          setDestinations(response.data.data);
        } else {
          console.error("Unexpected API response format:", response.data);
          setDestinations([]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching destinations:', error);
        setError('Failed to load destinations.');
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    
    // Hide the buttons before capturing
    const downloadButtons = document.getElementById('download-buttons');
    if (downloadButtons) {
      downloadButtons.style.display = 'none';
    }
    
    try {
      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        letterRendering: true
      });
      
      // Restore the buttons
      if (downloadButtons) {
        downloadButtons.style.display = 'flex';
      }
      
      const imgData = canvas.toDataURL('image/png');
      
      // Calculate dimensions
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const doc = new jsPDF('p', 'mm', 'a4');
      
      // Add image to PDF (with padding)
      const margin = 2; // margin in mm
      doc.addImage(imgData, 'PNG', margin, margin, imgWidth - (margin * 2), imgHeight - (margin * 2));
      
      // If the image height is greater than page height, create multiple pages
      let heightLeft = imgHeight;
      let position = 0;
      
      while (heightLeft > pageHeight) {
        position = heightLeft - pageHeight;
        doc.addPage();
        doc.addImage(imgData, 'PNG', margin, -(position + margin), imgWidth - (margin * 2), imgHeight - (margin * 2));
        heightLeft -= pageHeight;
      }
      
      doc.save('destination_report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
      
      // Restore the buttons in case of error
      if (downloadButtons) {
        downloadButtons.style.display = 'flex';
      }
    }
  };

  const handleDownloadExcel = () => {
    try {
      // Prepare the data for Excel
      const excelData = destinations.map(destination => ({
        'Destination ID': destination.destination_id,
        'Destination Name': destination.destination_name,
        'Location': destination.location,
        'Climate': destination.climate,
        'Rating': destination.destination_rating,
        'Best Time to Visit': destination.best_time_to_visit
      }));
      
      // Create a new workbook
      const workbook = XLSX.utils.book_new();
      
      // Convert the data to a worksheet
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      
      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Destinations');
      
      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      
      // Save the file
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'destination_report.xlsx');
    } catch (error) {
      console.error('Error generating Excel:', error);
      alert('Failed to generate Excel file. Please try again.');
    }
  };

  // Helper function for climate badges
  const getClimateStyle = (climate) => {
    return {
      backgroundColor: '#d4ac0d',
      color: 'white',
      borderRadius: '12px',
      padding: '3px 8px',
      fontSize: '0.75rem',
      fontWeight: 'bold',
      display: 'inline-block'
    };
  };
  
  return (
    <Box>
      <Box display="flex">
        <Sidebar />
        <Box 
          ref={reportRef}
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center" 
          p={2} 
          style={{ 
            flex: 1, 
            minHeight: '100vh', 
            backgroundColor: 'white', 
            borderRadius: 8, 
            boxShadow: '0px 0px 10px rgba(0,0,0,0.1)', 
            margin: '15px', 
            position: 'relative',
            marginTop: '15px', 
            marginBottom: '15px',
          }} 
          id="printable-section"
        >
          {/* Letterhead image */}
          <img 
            src={letterheadImage} 
            alt="Letterhead" 
            style={{ 
              width: '100%', 
              marginBottom: '20px', 
              borderBottom: '2px solid #d4ac0d', 
              boxSizing: 'border-box',
            }} 
          />
          
          {/* Page Title */}
          <Typography variant="h4" gutterBottom style={{ 
            marginBottom: '20px', 
            fontFamily: 'cursive', 
            fontWeight: 'bold', 
            color: 'purple', 
            textAlign: 'center' 
          }}>
            Destinations Report
          </Typography>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: '#d4ac0d', color: 'white' }}>
                  <TableCell style={{ borderRight: '1px solid #ddd', color: 'white' }}><strong>Image</strong></TableCell>
                  <TableCell style={{ borderRight: '1px solid #ddd', color: 'white' }}><strong>Destination ID</strong></TableCell>
                  <TableCell style={{ borderRight: '1px solid #ddd', color: 'white' }}><strong>Destination Name</strong></TableCell>
                  <TableCell style={{ borderRight: '1px solid #ddd', color: 'white' }}><strong>Location</strong></TableCell>
                  <TableCell style={{ borderRight: '1px solid #ddd', color: 'white' }}><strong>Climate</strong></TableCell>
                  <TableCell style={{ borderRight: '1px solid #ddd', color: 'white' }}><strong>Rating</strong></TableCell>
                  <TableCell style={{ color: 'white' }}><strong>Best Time to Visit</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {destinations.map((destination) => (
                  <TableRow key={destination._id}>
                    <TableCell style={{ borderRight: '1px solid #ddd' }}>
                      <Avatar 
                        src={destination.destination_image} 
                        alt={destination.destination_name}
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: '50%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/50?text=Destination";
                        }}
                      />
                    </TableCell>
                    <TableCell style={{ borderRight: '1px solid #ddd' }}>{destination.destination_id}</TableCell>
                    <TableCell style={{ borderRight: '1px solid #ddd' }}>{destination.destination_name}</TableCell>
                    <TableCell style={{ borderRight: '1px solid #ddd' }}>{destination.location}</TableCell>
                    <TableCell style={{ borderRight: '1px solid #ddd' }}>
                      <span style={getClimateStyle(destination.climate)}>
                        {destination.climate}
                      </span>
                    </TableCell>
                    <TableCell style={{ borderRight: '1px solid #ddd' }}>
                      <Rating 
                        value={destination.destination_rating} 
                        readOnly 
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{destination.best_time_to_visit}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Box mt={4} display="flex" justifyContent="left" gap={2} id="download-buttons">
            <Button 
              variant="contained" 
              color="secondary" 
              onClick={handleDownloadPDF}
            >
              Download PDF
            </Button>
            <Button 
              variant="contained" 
              style={{ backgroundColor: '#d4ac0d', color: 'white', marginLeft: '15px' }}
              onClick={handleDownloadExcel}
            >
              Download Excel
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DestinationReportPage;
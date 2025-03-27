import React, { useEffect, useState, useRef } from 'react';
import Sidebar from '../../Components/sidebar';
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
  Button
} from '@material-ui/core';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import letterheadImage from '../../Images/letterhead.png'; 
import Rating from '@material-ui/lab/Rating';

const HotelReportPage = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const reportRef = useRef(null);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await axios.get('http://localhost:3001/hotel/get-hotels');
        
        if (Array.isArray(response.data)) {
          setHotels(response.data);
        } else if (response.data && Array.isArray(response.data.hotels)) {
          setHotels(response.data.hotels);
        } else if (response.data && Array.isArray(response.data.data)) {
          setHotels(response.data.data);
        } else {
          console.error("Unexpected API response format:", response.data);
          setHotels([]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching hotels:', error);
        setError('Failed to load hotels.');
        setLoading(false);
      }
    };

    fetchHotels();
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
      
      doc.save('hotel_report.pdf');
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
      const excelData = hotels.map(hotel => ({
        'Hotel ID': hotel.hotel_id,
        'Hotel Name': hotel.hotel_name,
        'City': hotel.city,
        'Phone Number': hotel.phone_number,
        'Website': hotel.website,
        'Star Rating': hotel.star_rating
      }));
      
      // Create a new workbook
      const workbook = XLSX.utils.book_new();
      
      // Convert the data to a worksheet
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      
      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Hotels');
      
      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      
      // Save the file
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'hotel_report.xlsx');
    } catch (error) {
      console.error('Error generating Excel:', error);
      alert('Failed to generate Excel file. Please try again.');
    }
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
            Hotels Report
          </Typography>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: '#d4ac0d', color: 'white' }}>
                  <TableCell style={{ borderRight: '1px solid #ddd', color: 'white' }}><strong>Hotel ID</strong></TableCell>
                  <TableCell style={{ borderRight: '1px solid #ddd', color: 'white' }}><strong>Hotel Name</strong></TableCell>
                  <TableCell style={{ borderRight: '1px solid #ddd', color: 'white' }}><strong>City</strong></TableCell>
                  <TableCell style={{ borderRight: '1px solid #ddd', color: 'white' }}><strong>Phone Number</strong></TableCell>
                  <TableCell style={{ borderRight: '1px solid #ddd', color: 'white' }}><strong>Website</strong></TableCell>
                  <TableCell style={{ color: 'white' }}><strong>Star Rating</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {hotels.map((hotel) => (
                  <TableRow key={hotel._id}>
                    <TableCell style={{ borderRight: '1px solid #ddd' }}>{hotel.hotel_id}</TableCell>
                    <TableCell style={{ borderRight: '1px solid #ddd' }}>{hotel.hotel_name}</TableCell>
                    <TableCell style={{ borderRight: '1px solid #ddd' }}>{hotel.city}</TableCell>
                    <TableCell style={{ borderRight: '1px solid #ddd' }}>{hotel.phone_number}</TableCell>
                    <TableCell style={{ borderRight: '1px solid #ddd' }}>{hotel.website}</TableCell>
                    <TableCell>
                      <Rating 
                        value={hotel.star_rating} 
                        readOnly 
                        size="small"
                      />
                    </TableCell>
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

export default HotelReportPage;
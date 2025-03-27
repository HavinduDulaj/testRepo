import React from 'react';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';
import Header from '../../Components/navbar';
import { useNavigate } from 'react-router-dom';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const MainSection = styled.div`
  display: flex;
  flex-grow: 1;
`;

const MainContent = styled.div`
  flex-grow: 1;
  padding: 20px;
  margin-top: 40px;
`;

const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  margin-top: 20px;
`;

const Card = styled.div`
  background-color: #FFFFF0;
  flex: 1;
  min-width: 200px;
  max-width: 300px;
  height: 500px; /* Increased height to accommodate illustrations */
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #333;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  }
`;

const IllustrationContainer = styled.div`
  margin-bottom: 15px;
  width: 200px; /* Adjust size as needed */
  height: 450px; /* Adjust size as needed */
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 120%;
    height: 120%;
    object-fit: contain;
  }
`;

const CardTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 40px;
`;

const MainDashboard = () => {
  const navigate = useNavigate();

  // Card data with external image URLs
  const cards = [
    {
      title: 'User Management',
      illustration: 'https://img.freepik.com/free-photo/happy-young-woman-sitting-rock-with-holding-binoculars_23-2147842487.jpg?uid=R70363395&ga=GA1.1.265447444.1742467879', // Replace with your image URL
      path: '/view-hotels',
    },
    {
      title: 'Hotel Management',
      illustration: 'https://images.pexels.com/photos/20836060/pexels-photo-20836060/free-photo-of-vehicles-on-street-by-hotel-in-kandy-town-sri-lanka.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', // Replace with your image URL
      path: '/view-hotels',
    },
    {
      title: 'Destination Management',
      illustration: 'https://img.freepik.com/free-photo/girl-red-dress-dancing-waterfall_72229-1288.jpg?uid=R70363395&ga=GA1.1.265447444.1742467879', // Replace with your image URL
      path: '/view-destination',
    },
    {
      title: 'Tour Package Management',
      illustration: 'https://img.freepik.com/free-photo/beautiful-endangered-american-jaguar-nature-habitat-panthera-onca-wild-brasil-brasilian-wildlife-pantanal-green-jungle-big-cats_475641-2209.jpg?uid=R70363395&ga=GA1.1.265447444.1742467879', // Replace with your image URL
      path: '/gps-tracking',
    },
  ];

  return (
    <DashboardContainer>
      <MainSection>
        <MainContent>
          <Typography variant="h4" gutterBottom style={{ marginBottom: '20px', fontFamily: 'cursive', fontWeight: 'bold', color: 'purple', textAlign: 'center' }}>
            Main Dashboard
          </Typography>
          {/* Card Views for Navigation */}
          <CardContainer>
            {cards.map((card, index) => (
              <Card key={index} onClick={() => navigate(card.path)}>
                <IllustrationContainer>
                  <img src={card.illustration} alt={card.title} />
                </IllustrationContainer>
                <CardTitle>{card.title}</CardTitle>
              </Card>
            ))}
          </CardContainer>
        </MainContent>
      </MainSection>
    </DashboardContainer>
  );
};

export default MainDashboard;
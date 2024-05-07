import React, { useState, useEffect } from 'react';
import './HotelMatch.css';
import { db } from './firebase'; // Make sure this path is correct
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useLocation } from 'react-router-dom'; 
import NavigationMenu from './Navbar';

function HotelMatch() {
  const [hotelData, setHotelData] = useState([]);
  const location = useLocation();
  const predictionData = location.state?.predictionData;

  useEffect(() => {
    console.log(location.state?.predictionData);
    if (predictionData && Array.isArray(predictionData.predicted_labels)) {
      console.log('Received prediction data:', predictionData.predicted_labels);
      fetchHotelData(predictionData.predicted_labels);
    }
  }, [predictionData]);

  const fetchHotelData = async (predictedLabels) => {
    const hotelsCollectionRef = collection(db, "hotels");
    const promises = predictedLabels.map(label => {
      const q = query(hotelsCollectionRef, where("ID", "==", label));
      return getDocs(q);
    });

    try {
      const querySnapshots = await Promise.all(promises);
      const fetchedHotels = querySnapshots.map(snapshot => snapshot.docs.map(doc => doc.data())).flat();
      setHotelData(fetchedHotels.length > 0 ? fetchedHotels : null);
    } catch (error) {
      console.error("Error fetching hotel data:", error);
      alert("Failed to fetch hotel details.");
    }
  };

  return (
    <div className="hotel-match">
      <header className="header">
        <NavigationMenu />
      </header>
      <main className="content">
        {hotelData && hotelData.length > 0 ? (
          hotelData.map((hotel, index) => (
            <section key={index} className="hotel-room-image">
              <h2>Hotel Details</h2>
              {/* Uncomment and modify the next line if image data is available */}
              {/* <img src={hotel.image1} alt={hotel.name} className="image-placeholder" /> */}
              <div><strong>Name:</strong> {hotel.name}</div>
              <div><strong>Location:</strong> {hotel.location}</div>
              <div><strong>Number of Cases:</strong> {hotel.numberOfCases}</div>
            </section>
          ))
        ) : (
          <div>Loading hotel details...</div>
        )}
      </main>
    </div>
  );
}

export default HotelMatch;

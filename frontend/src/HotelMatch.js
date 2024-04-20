import React, { useState, useEffect } from 'react';
import './HotelMatch.css';
import { db } from './firebase'; // Make sure this path is correct
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useLocation } from 'react-router-dom'; 

  function HotelMatch() {
    const [hotelData, setHotelData] = useState(null);
    const [hotelId, setHotelId] = useState('21494'); // Default ID for demonstration
    const location = useLocation(); // Use location to access navigation state
    const predictionData = location.state?.predictionData;
  
    useEffect(() => {
      if (predictionData) {
        console.log('Received prediction data:', predictionData.predicted_label); // Log the received data
      }
  
      // Existing fetchHotelData logic
    }, [predictionData]); 

    useEffect(() => {
      const fetchHotelData = async () => {
        const hotelsCollectionRef = collection(db, "hotels");
        const q = query(hotelsCollectionRef, where("ID", "==", predictionData.predicted_label));
        const querySnapshot = await getDocs(q);
  
        if (!querySnapshot.empty) {
          // Assuming only one hotel will match the ID
          const fetchedHotel = querySnapshot.docs[0].data();
          setHotelData(fetchedHotel);
        } else {
          console.log("No hotel found with the ID:", hotelId);
          alert("No hotel found with the provided ID.");
        }
      };
  
      fetchHotelData();
    }, [hotelId]); // This effect runs when hotelId changes

  return (
    <div className="hotel-match">
      <header className="header">
        <div className="title">Law Enforcement Portal</div>
        <nav className="navigation">
          <a href="/home">Home</a>
          <a href="/cases">Cases</a>
        </nav>
      </header>

      <main className="content">
        {hotelData ? (
          <section className="hotel-room-image">
            <h2>Hotel Details</h2>
            <img src={hotelData.image1} alt={hotelData.name} className="image-placeholder" />
            <div><strong>Name:</strong> {hotelData.name}</div>
            <div><strong>Location:</strong> {hotelData.location}</div>
            <div><strong>Number of Cases:</strong> {hotelData.numberOfCases}</div>
          </section>
        ) : (
          <div>Loading hotel details...</div>
        )}
      </main>

      <footer className="footer">
        © 2022 Law Enforcement Portal. All rights reserved.
      </footer>
    </div>
  );
}

export default HotelMatch;

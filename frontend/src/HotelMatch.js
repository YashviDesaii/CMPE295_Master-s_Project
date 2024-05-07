import React, { useState, useEffect } from 'react';
import './HotelMatch.css';
import { db } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useLocation } from 'react-router-dom'; 
import NavigationMenu from './Navbar';

function HotelMatch() {
  const [hotelData, setHotelData] = useState([]);
  const location = useLocation();
  const predictionData = location.state?.predictionData;

  useEffect(() => {
    if (predictionData && predictionData.hotelIds) {
      console.log('Received prediction data:', predictionData);
      fetchHotelData(predictionData);
    }
  }, [predictionData]);
  
  function softmax(arr) {
    return arr.map(value => Math.exp(value))
               .reduce((a, b) => a + b, 0);
  }
  const fetchHotelData = async (predictionData) => {
    const { hotelIds, probabilities } = predictionData;
    const sumOfExps = softmax(probabilities);
    const hotelsCollectionRef = collection(db, "hotels");
    const promises = hotelIds.map((id, index) => {
      const q = query(hotelsCollectionRef, where("ID", "==", id));
      return getDocs(q).then(snapshot => {
        // Assuming each query returns exactly one doc
        const hotelData = snapshot.docs.map(doc => doc.data())[0];
        const probability = (Math.exp(probabilities[index]) / sumOfExps) * 100; // softmax probability to percentage
        return { ...hotelData, probability: probability.toFixed(2) }; // Formatting probability
      });
    });

    try {
      const results = await Promise.all(promises);
      setHotelData(results);
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
              <div><strong>ID:</strong> {hotel.ID}</div>
              <div><strong>Location:</strong> {hotel.location}</div>
              <div><strong>Match Probability:</strong> {hotel.probability}%</div>
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

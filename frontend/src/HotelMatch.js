import React, { useState, useEffect } from 'react';
import './HotelMatch.css';
import { db } from './firebase';
import { collection, query, where, getDocs, addDoc, updateDoc } from 'firebase/firestore';
import { useLocation } from 'react-router-dom'; 
import NavigationMenu from './Navbar';

function HotelMatch() {
  const [hotelData, setHotelData] = useState([]);
  const location = useLocation();
  const predictionData = location.state?.predictionData;
  const caseId = location.state?.caseId;

  console.log("case id here",caseId);

  useEffect(() => {
    if (predictionData && predictionData.hotelIds) {
      console.log('Received prediction data:', predictionData);
      fetchHotelData(predictionData, caseId);
    }
  }, [predictionData]);

  function softmax(arr) {
    const maxLog = Math.max(...arr);
    const scaleArr = arr.map(value => Math.exp(value - maxLog));
    const sum = scaleArr.reduce((acc, val) => acc + val, 0);
    return scaleArr.map(value => value / sum);
  }

  const fetchHotelData = async (predictionData, caseId) => {
    const { hotelIds, probabilities } = predictionData;
    const softmaxProbabilities = softmax(probabilities);
    const hotelsCollectionRef = collection(db, "hotels");
    const promises = hotelIds.map((id, index) => {
      const q = query(hotelsCollectionRef, where("ID", "==", id));
      return getDocs(q).then(snapshot => {
        if (snapshot.empty) {
          // No matching document, create a new hotel entry
          const newHotel = {
            ID: id,
            probability: (softmaxProbabilities[index] * 100).toFixed(2), // Formatting probability
            relatedCases: [caseId],  // Initialize with caseId
          };
          addDoc(hotelsCollectionRef, newHotel)
            .then(docRef => {
              console.log("Document written with ID: ", docRef.id);
              return { ...newHotel, firebaseId: docRef.id };
            })
            .catch((error) => {
              console.error("Error adding document: ", error);
            });
        } else {
          // // Assuming each query returns exactly one doc
          // const hotelData = snapshot.docs.map(doc => doc.data())[0];
          // const probability = (softmaxProbabilities[index] * 100).toFixed(2); // Softmax probability to percentage
          // // Check if relatedCases array exists, if not create it and add caseId
          // hotelData.relatedCases = hotelData.relatedCases || [];
          // hotelData.relatedCases.push(caseId);
          // return { ...hotelData, probability }; // Formatting probability

          console.log("getting into else part");
          const hotelDoc = snapshot.docs[0]; // Get the document reference
          const hotelsData = hotelDoc.data();
          hotelsData.relatedCases.push(caseId);
          
          try {
            // Update the document in Firebase with the new relatedCases array
            updateDoc(hotelDoc.ref, { relatedCases: hotelsData.relatedCases });
            return { ...hotelsData, firebaseId: hotelDoc.id };
          } catch (error) {
            console.error("Error updating document: ", error);
            alert("Failed to update hotel data.");
          }
        }
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

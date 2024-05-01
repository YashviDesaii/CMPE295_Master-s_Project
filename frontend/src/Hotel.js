import React, { useEffect, useState } from 'react';
import './Hotel.css';
import { db } from './firebase';
import { collection, query, getDocs, getDoc, doc } from 'firebase/firestore';
import NavigationMenu from './Navbar';

function Hotel() {
  const [hotels, setHotels] = useState([]);
  const [selectedHotelId, setSelectedHotelId] = useState('');
  const [selectedHotelData, setSelectedHotelData] = useState(null);

  useEffect(() => {
    const fetchHotels = async () => {
      const hotelsCollection = collection(db, 'hotels');
      const q = query(hotelsCollection);
      const qsnapshot = await getDocs(q);

      if (!qsnapshot.empty) {
        const fetchedHotels = qsnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          location: doc.data().location, // Assuming location is a field in the document
          image: doc.data().image1, // Assuming image is a field in the document
        }));
        setHotels(fetchedHotels);
      }
    };

    fetchHotels();
  }, []); // Empty dependency array means fetch once on component mount

  const handleSelect = async event => {
    const selectedHotelId = event.target.value;
    setSelectedHotelId(''); // Clear selected ID until data is fetched
    setSelectedHotelData(null); // Clear selected data until new data is fetched

    // Find the ID of the selected hotel based on its name
    const selectedHotel = hotels.find(hotel => hotel.id === selectedHotelId);
    if (selectedHotel) {
      setSelectedHotelId(selectedHotel.id);

      // Fetch the selected hotel's document
      const hotelRef = doc(db, 'hotels', selectedHotelId);
      console.log(hotelRef)
      const hotelSnapshot = await getDoc(hotelRef);

      if (hotelSnapshot.exists()) { // Check if the document exists
        const hotelData = hotelSnapshot.data();
        setSelectedHotelData(hotelData);
      }
    }
  };

  console.log(selectedHotelData)

  return (
    <div className="hotel">
      <header className="header">
        <NavigationMenu />
      </header>
      <main className="main-content">
        <section className="hotel-info">
          <h1>Please select a hotel from the dropdown</h1>
          <select value={selectedHotelId} onChange={handleSelect}>
            <option value="">Select a hotel</option>
            {hotels.map((hotel, index) => (
              <option key={hotel.id} value={hotel.id}>
                {hotel.name}
              </option>
            ))}
          </select>
          {selectedHotelData && (
            <div>
              <p>Selected Hotel: {selectedHotelData.name}</p>
              <p>Location: {selectedHotelData.location}</p>
              <div className="hotel-images">
                <h2>Images</h2>
                  {selectedHotelData && selectedHotelData.image1 && (
                    <img src={selectedHotelData.image1} alt="Room photo" />
                  )}
                </div>
              </div>
           )}
        </section>
        <section className="related-cases">
          <h2>Related Cases</h2>
          <div className="cases-group">
            <div className="case">Case 1<br/>Case description 1</div>
            <div className="case">Case 2<br/>Case description 2</div>
            <div className="case">Case 3<br/>Case description 3</div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Hotel;

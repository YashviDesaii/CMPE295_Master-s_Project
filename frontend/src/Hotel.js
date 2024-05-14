import React, { useEffect, useState } from 'react';
import './Hotel.css';
import { db } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
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
                    docId: doc.id,  // Firestore document ID for internal reference
                    ID: doc.data().ID,  // Custom hotel ID, assumed to be a number
                    image1: doc.data().image1,
                    relatedCases: doc.data().relatedCases || []
                }));
                setHotels(fetchedHotels);
            }
        };
        fetchHotels();
    }, []);

    const handleSelect = async event => {
        const newSelectedHotelId = parseInt(event.target.value, 10); // Convert to integer
        setSelectedHotelData(null);

        if (newSelectedHotelId) {
            // Query the document by custom hotel ID, ensure it matches the numeric type
            const hotelsCollection = collection(db, 'hotels');
            const q = query(hotelsCollection, where("ID", "==", newSelectedHotelId));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const hotelData = querySnapshot.docs[0].data();
                setSelectedHotelData(hotelData);
                setSelectedHotelId(newSelectedHotelId);
            } else {
                console.log("No data available for hotel ID:", newSelectedHotelId);
                setSelectedHotelId('');
            }
        } else {
            setSelectedHotelId('');
        }
    };
    const WelcomeBanner = () => (
        <section className="welcome-banner">
         <h2>View all hotels</h2>
         <p>Keep track of all the hotels allegedly involved in human trafficking</p>
        </section>
      );

    return (
        <div className="hotel">
            <header className="header">
                <NavigationMenu />
            </header>
            <WelcomeBanner />
            <main className="main-content">
                <section className="hotel-info">
                    <h1>Please select a hotel from the dropdown</h1>
                    <select value={selectedHotelId} onChange={handleSelect}>
                        <option value="">Select a hotel</option>
                        {hotels.map((hotel, index) => (
                            <option key={index} value={hotel.ID}>
                                {hotel.ID}
                            </option>
                        ))}
                    </select>
                    {selectedHotelData && (
                        <div>
                            <p>Selected Hotel ID: {selectedHotelData.ID}</p>
                            {selectedHotelData.image1 ? (
                                <div className="hotel-images">
                                    <h2>Images</h2>
                                    <img src={selectedHotelData.image1} alt="Hotel photo" />
                                </div>
                            ) : (
                                <p>No image available.</p>
                            )}
                            <h2>Related Cases</h2>
                            {selectedHotelData.relatedCases.length > 0 ? (
                                selectedHotelData.relatedCases.map((caseId, idx) => (
                                    <p key={idx}>{caseId}</p>
                                ))
                            ) : (
                                <p>No related cases.</p>
                            )}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default Hotel;

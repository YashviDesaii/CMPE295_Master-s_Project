import React, { useState } from 'react';
import './ActiveCases.css'; // Assuming your CSS file is named CaseManagement.css

// Dummy data for cases and images
const cases = [
  { id: 1, number: 'Case 1', hotel: 'Hotel XYZ' },
  { id: 2, number: 'Case 2', hotel: 'Hotel ABC' },
  { id: 3, number: 'Case 3', hotel: 'Hotel MNO' },
  // ... more cases
];

// Replace with actual image paths
const images = [
  'image1.jpg',
  'image2.jpg',
  'image3.jpg',
  // ... more images
];

const ActiveCases = () => {
  const [activeIndex, setActiveIndex] = useState(0); // For the image carousel

  // Handler to go to the next image in the carousel
  const nextImage = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // Handler to go to the previous image in the carousel
  const prevImage = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="case-management">
      <div className="cases-column">
        <h2>Active Cases</h2>
        <p>Click on a case to view details</p>
        <ul className="case-list">
          {cases.map((caseItem) => (
            <li key={caseItem.id} className="case-item">
              <img src="case-icon.png" alt="Case Icon" className="case-icon" />
              <div className="case-info">
                <span className="case-number">{caseItem.number}</span>
                <span className="hotel-name">{caseItem.hotel}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="carousel-column">
        <div className="image-carousel">
          <button className="carousel-control prev" onClick={prevImage}>‹</button>
          <img src={images[activeIndex]} alt={`Slide ${activeIndex}`} />
          <button className="carousel-control next" onClick={nextImage}>›</button>
        </div>
      </div>
    </div>
  );
};

export default ActiveCases;

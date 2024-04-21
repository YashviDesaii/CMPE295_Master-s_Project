import React from 'react';
import './HumanTraffickingPortal.css'; // Ensure the CSS file is named accordingly
import NavigationMenu from './Navbar';

const HumanTraffickingPortal = () => {
  return (
    <div className="portal-container">
      <header className="header">
        <NavigationMenu/>
      </header>
      <div className="search-section">
        <h2>Human Trafficking Cases Map</h2>
        <input type="text" placeholder="Search Location" />
        <button>Search</button>
      </div>

      <div className="cases-summary">
        <h3>Cases Summary</h3>
        <p>Total Cases: 125</p>
        <div className="region-summary">
          <div>Region A Count: 50 Lorem ipsum...</div>
          <div>Region B Count: 30 Nunc laoreet...</div>
          <div>Region C Count: 45 Curabitur tempus...</div>
        </div>
      </div>

      <div className="map-view">
        <p>Bubble Map View</p>
        {/* Here you can include the map component or an image placeholder */}
      </div>
      
      <footer>
        © 2022 Human Trafficking Portal. All rights reserved.
      </footer>
    </div>
  );
};

export default HumanTraffickingPortal;

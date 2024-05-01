import React, { useState, useEffect } from 'react';
import './HumanTraffickingPortal.css'; 
import NavigationMenu from './Navbar';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';

const HeatmapLayer = ({ incidents }) => {
  const map = useMap();

  useEffect(() => {
    if (incidents.length > 0) {
      const validIncidents = incidents.filter(incident => {
        const lat = parseFloat(incident.latitude);
        const lng = parseFloat(incident.longitude);
        const isValidLat = !isNaN(lat) && lat !== null;
        const isValidLng = !isNaN(lng) && lng !== null;
        if (!isValidLat || !isValidLng) {
          console.error('Invalid coordinates:', incident);
        }
        return isValidLat && isValidLng;
      });

      const points = validIncidents.map(incident => [incident.latitude, incident.longitude, 1]); 
      const heat = L.heatLayer(points, { radius: 25 }).addTo(map);

      return () => map.removeLayer(heat);
    }
  }, [incidents, map]);

  return null;
};

const HumanTraffickingPortal = () => {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    fetch('https://data.seattle.gov/resource/kzjm-xkqj.json')
      .then(response => response.json())
      .then(data => {
        const validData = data.filter(item => item.latitude && item.longitude);
        setIncidents(validData);
      })
      .catch(error => {
        console.log('Error fetching data:', error);
      });
  }, []);

  return (
    <div className="portal-container">
      <header className="header">
        <NavigationMenu />
      </header>
      <div className="search-section">
        <h2>Human Trafficking Cases Map</h2>
        <input type="text" placeholder="Search Location" />
        <button>Search</button>
      </div>

      <div className="cases-summary">
        <h3>Cases Summary</h3>
        <p>Total Cases: {incidents.length}</p>
      </div>

      <div className="map-view">
        <MapContainer center={[47.6062, -122.3321]} zoom={12} scrollWheelZoom={false} style={{ height: '400px', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <HeatmapLayer incidents={incidents} />
        </MapContainer>
      </div>
      
      <footer>
        © 2022 Human Trafficking Portal. All rights reserved.
      </footer>
    </div>
  );
};

export default HumanTraffickingPortal;

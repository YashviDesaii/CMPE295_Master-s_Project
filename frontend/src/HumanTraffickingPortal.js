import React, { useState, useEffect } from 'react';
import './HumanTraffickingPortal.css'; 
import NavigationMenu from './Navbar';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

const getCoordinatesForDepartment = async (location) => {
  const apiKey = "f6782bf05ee54eea97bb14784b4d76de";
  const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(location)}&apiKey=${apiKey}`;
  try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.features && data.features.length > 0) {
          const { lat, lon } = data.features[0].properties;
          return { lat, lng: lon };
      }
      return null;
  } catch (error) {
      console.error('Failed to fetch coordinates:', error);
      return null;
  }
};

// Component to show department locations as markers
const DepartmentLocationLayer = ({ departments }) => {
  const map = useMap();

  useEffect(() => {
    const fetchCoordinatesAndSetMarkers = async () => {
        const promises = departments.map(async department => {
            const coords = await getCoordinatesForDepartment(department.name);
            if (coords) {
                L.marker([coords.lat, coords.lng], {
                    icon: L.icon({
                        iconUrl: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34]
                    })
                }).addTo(map)
                  .bindPopup(`Department: ${department.name}`);
            }
        });

        await Promise.all(promises);

        return () => {
            map.eachLayer(layer => {
                if (layer instanceof L.Marker) {
                    map.removeLayer(layer);
                }
            });
        };
    };

    fetchCoordinatesAndSetMarkers();
}, [departments, map]);

return null;
};

const HeatmapLayer = ({ incidents }) => {
  const map = useMap();

  useEffect(() => {
    if (incidents.length > 0) {
      const validIncidents = incidents.filter(incident => {
        const lat = parseFloat(incident.latitude);
        const lng = parseFloat(incident.longitude);
        return !isNaN(lat) && lat !== null && !isNaN(lng) && lng !== null;
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
  const [departments, setDepartments] = useState([]);

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
      const fetchDepartments = async () => {
        const querySnapshot = await getDocs(collection(db, 'policeReports'));
        const departmentData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return { name: data.departmentLocation };
        });
        setDepartments(departmentData);
      };
  
      fetchDepartments();
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
          <DepartmentLocationLayer departments={departments} />
        </MapContainer>
      </div>
      
      <footer>
        © 2022 Human Trafficking Portal. All rights reserved.
      </footer>
    </div>
  );
};

export default HumanTraffickingPortal;

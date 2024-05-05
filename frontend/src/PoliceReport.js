import React, { useState } from 'react';
import axios from 'axios';
import './PoliceReport.css';
import { collection, addDoc } from "firebase/firestore"; 
import { db, storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from 'react-router-dom';
import NavigationMenu from './Navbar';

const PoliceReportForm = () => {
  var caseNumber = 0
  var caseDate = ''
  const [formState, setFormState] = useState({
    // caseNumber: '',
    reportingOfficer: '',
    departmentLocation: '',
    caseDescription: '',
    victimCount: '',
    image: null,
  });

  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleImageChange = (event) => {
    setFormState({
      ...formState,
      image: event.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrl = "";
    if (formState.image) {
      const storageRef = ref(storage, `images/${formState.image.name}`);
      try {
        const snapshot = await uploadBytes(storageRef, formState.image);
        imageUrl = await getDownloadURL(snapshot.ref);
      } catch (error) {
        console.error("Failed to upload image: ", error);
        alert("Failed to upload image, please try again.");
        return;
      }
    }

    try {
      const docRef = await addDoc(collection(db, "policeReports"), {
        caseNumber: Math.floor(Math.random() * 10000),
        caseDate: new Date().toLocaleDateString(),
        reportingOfficer: formState.reportingOfficer,
        departmentLocation: formState.departmentLocation,
        caseDescription: formState.caseDescription,
        victimCount: formState.victimCount,
        imageUrl: imageUrl
      });
  

      // Make a POST request with the data to the Flask backend
      const response = await axios.post('http://127.0.0.1:5000/predict', {
        caseNumber: caseNumber,
        reportingOfficer: formState.reportingOfficer,
        departmentLocation: formState.departmentLocation,
        caseDescription: formState.caseDescription,
        victimCount: formState.victimCount,
        imageUrl: imageUrl
      });

      if (response.data) {
        // Handle the response data as needed
        console.log('Prediction from server:', response.data);
        navigate('/hotel-match', { state: { predictionData: response.data } });
        //alert('Prediction received: ' + response.data.label);

      }
  
      // Reset form state after submission
      setFormState({
        // caseNumber: '',
        reportingOfficer: '',
        departmentLocation: '',
        caseDescription: '',
        victimCount:'',
        image: null,
      });
  
    } catch (error) {
      console.error('Error submitting report: ', error);
      alert(error.message);
    }
  };
  
  return (
    <div className="police-reporting">
      <header className="header">
        <NavigationMenu/>
      </header>
      <h1 style={{ textAlign: 'center' }}>New Police Report</h1>
      <form onSubmit={handleSubmit}>
        {/* <div className="form-group">
          <label htmlFor="caseNumber">Case Number</label>
          <input
            type="text"
            id="caseNumber"
            name="caseNumber"
            value={formState.caseNumber}
            onChange={handleInputChange}
            required
          />
        </div> */}
  
        <div className="form-group">
          <label htmlFor="reportingOfficer">Reporting Officer</label>
          <input
            type="text"
            id="reportingOfficer"
            name="reportingOfficer"
            value={formState.reportingOfficer}
            onChange={handleInputChange}
            required
          />
        </div>
  
        <div className="form-group">
          <label htmlFor="departmentLocation">Police Department Location</label>
          <input
            type="text"
            id="departmentLocation"
            name="departmentLocation"
            value={formState.departmentLocation}
            onChange={handleInputChange}
            required
          />
        </div>
  
        <div className="form-group">
          <label htmlFor="caseDescription">Case Description</label>
          <textarea
            id="caseDescription"
            name="caseDescription"
            value={formState.caseDescription}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="victimCount">Victim Count</label>
          <input
            id="victimCount"
            name="victimCount"
            value={formState.victimCount}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="image">Image</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleImageChange}
          />
        </div>
  
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default PoliceReportForm;

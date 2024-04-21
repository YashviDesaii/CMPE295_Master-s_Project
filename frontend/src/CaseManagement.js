import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PoliceReportForm from './PoliceReport';
import './CaseManagement.css';
import NavigationMenu from './Navbar';

const CaseManagement = () => {
  const [cases, setCases] = useState([
    { id: 1, name: 'Case 1', location: 'Hotel XYZ', status: 'Active', victimsCount: 10, officer: 'John Doe' },
    // Add more preloaded cases here
  ]);
  const [activeCase, setActiveCase] = useState(null);
  const [caseForm, setCaseForm] = useState({
    caseNumber: '',
    reportingOfficer: '',
    location: '',
    caseDescription: '',
    // Assuming image would be handled separately with file upload functionality
  });

  const handleCaseSelect = (caseData) => {
    setActiveCase(caseData);
  };

  const handleFormChange = (e) => {
    setCaseForm({ ...caseForm, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Here you would handle form validation and submission, like adding a new case
    // For now, we'll just add it to the cases array
    const newCase = {
      ...caseForm,
      id: cases.length + 1, // Simple ID assignment, consider using a better ID system
      status: 'Active', // New cases default to active
      victimsCount: 0, // New cases start with zero victims
      officer: caseForm.reportingOfficer,
    };
    setCases([...cases, newCase]);
    setCaseForm({
      caseNumber: '',
      reportingOfficer: '',
      location: '',
      caseDescription: '',
    });
  };

  return (

    <div className="case-management-container">
      <header className="header">
        <NavigationMenu/>
      </header>
      <h1>Manage Your Cases</h1>
      <div className="cases-section">
        <h2>My Cases</h2>
        <div className="active-cases">
          <h3>Active Cases</h3>
          {cases.map((caseData) => (
            <div key={caseData.id} onClick={() => handleCaseSelect(caseData)} className="case-item">
              {caseData.name} - {caseData.location}
            </div>
          ))}
        </div>
      </div>

      {activeCase ? (
        <div className="case-details">
          <h2>Case Details</h2>
          <p>Case Number: {activeCase.id}</p>
          <p>Status: {activeCase.status}</p>
          <p>Hotel: {activeCase.location}</p>
          <p>Victims Count: {activeCase.victimsCount}</p>
          <p>Investigating Officer: {activeCase.officer}</p>
        </div>
      ) : (
        <Link to="/police-report">
          <button className= "casebutton" onClick={() => setActiveCase(null)}>Create New Case</button>
        </Link>
      )}
    </div>
  );
}

export default CaseManagement;
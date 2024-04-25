import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PoliceReportForm from './PoliceReport';
import './CaseManagement.css';
import NavigationMenu from './Navbar';
import ActiveCases from './ActiveCases';
import CaseDetailsList from './CaseDetailsList';

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

  const [showReportForm, setShowReportForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // Optionally, you can also filter the cases here based on the search term
  };

  const handleCaseSelect = (caseData) => {
    setActiveCase(caseData);
  };

  const handleNewCaseClick = () => {
    // Toggle visibility of PoliceReportForm
    setShowReportForm(true);
    setActiveCase(null); // Reset active case when creating new one
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

      <div className="search-container">
        <input
          type="text"
          className="search-bar"
          placeholder="Search cases..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="controls">
      <Link to="/police-report">
          <button className= "casebutton" onClick={() => setActiveCase(null)}>Create New Case</button>
        </Link>
        {/* Include additional filters/search here if needed */}
      </div>
      {showReportForm ? (
        <PoliceReportForm onSubmit={handleFormSubmit} />
      ) : (
        <>      
<ActiveCases/>
<CaseDetailsList cases={cases} /> {/* Add this line */}

</>
      )}
    </div>

  );

}



export default CaseManagement;
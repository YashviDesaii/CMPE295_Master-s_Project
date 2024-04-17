import React, { useState } from 'react';
import PoliceReportForm from './PoliceReport';

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
    <div>
      <h1>Case Management</h1>
      <div>
        <h2>My Cases</h2>
        <button onClick={() => setActiveCase(null)}>Create New Case</button>
        <div>
          <h3>Active Cases</h3>
          {cases.map((caseData) => (
            <div key={caseData.id} onClick={() => handleCaseSelect(caseData)}>
              {caseData.name} - {caseData.location}
            </div>
          ))}
        </div>
      </div>

      {activeCase ? (
        <div>
          <h2>Case Details</h2>
          <p>Case Number: {activeCase.id}</p>
          <p>Status: {activeCase.status}</p>
          <p>Hotel: {activeCase.location}</p>
          <p>Victims Count: {activeCase.victimsCount}</p>
          <p>Investigating Officer: {activeCase.officer}</p>
        </div>
       ) 
       : (
    //     <form onSubmit={handleFormSubmit}>
    //       <h2>New Police Report</h2>
    //       <label>
    //         Case Number:
    //         <input type="text" name="caseNumber" value={caseForm.caseNumber} onChange={handleFormChange} />
    //       </label>
    //       <label>
    //         Reporting Officer:
    //         <input type="text" name="reportingOfficer" value={caseForm.reportingOfficer} onChange={handleFormChange} />
    //       </label>
    //       <label>
    //         Police Department Location:
    //         <input type="text" name="location" value={caseForm.location} onChange={handleFormChange} />
    //       </label>
    //       <label>
    //         Case Description:
    //         <textarea name="caseDescription" value={caseForm.caseDescription} onChange={handleFormChange} />
    //       </label>
    //       {/* Here you'd add your image upload functionality */}
    //       <button type="submit">Submit</button>
    //     </form>
    <PoliceReportForm/>
       )}
    </div>
  );
};

export default CaseManagement;
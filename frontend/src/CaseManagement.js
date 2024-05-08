import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from './firebase'; // Make sure this path is correct based on your project structure
import NavigationMenu from './Navbar'; // Assuming you have this component for navigation
import CaseDetailsList from './CaseDetailsList';
import { collection, query, getDocs } from 'firebase/firestore';
import './CaseManagement.css'; 

const CaseManagement = () => {
  const [cases, setCases] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [casesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCase, setActiveCase] = useState(null);
  const [showReportForm, setShowReportForm] = useState(false);

  useEffect(() => {
    const fetchCases = async () => {
      const casesCollection = collection(db, 'policeReports');
      const q = query(casesCollection);
      const querySnapshot = await getDocs(q);
      const casesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCases(casesData);
    };
    fetchCases();
  }, []);

  const indexOfLastCase = currentPage * casesPerPage;
  const indexOfFirstCase = indexOfLastCase - casesPerPage;
  const currentCases = cases.slice(indexOfFirstCase, indexOfLastCase);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handleSearchChange = (e) => setSearchTerm(e.target.value);


  return (
    <div className="case-management-container">
      <header className="header">
        <NavigationMenu />
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
          <button className="case-button" onClick={() => setShowReportForm(!showReportForm)}>Create a New Case</button>
        </Link>
      </div>

      {showReportForm ? (
        <div>Form Component Here</div> // You can integrate a form component here if needed
      ) : (
        <CaseDetailsList
          cases={currentCases}
          paginate={paginate}
          currentPage={currentPage}
          totalCases={cases.length}
          casesPerPage={casesPerPage}
        />
      )}
    </div>
  );
}

export default CaseManagement;

import React, { useState, useMemo } from 'react';
import './CaseDetailsList.css';

const CaseDetailsList = ({ cases }) => {
  const [filters, setFilters] = useState({
    caseNumber: '',
    status: '',
    hotel: '',
    victimsCount: '',
    officer: '',
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value
    }));
  };

  // Memoize the filtered cases to avoid unnecessary computations on each render
  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      return (
        (filters.caseNumber ? c.name.includes(filters.caseNumber) : true) &&
        (filters.status ? c.status.includes(filters.status) : true) &&
        (filters.hotel ? c.location.includes(filters.hotel) : true) &&
        (filters.victimsCount ? c.victimsCount.toString() === filters.victimsCount : true) &&
        (filters.officer ? c.officer.includes(filters.officer) : true)
      );
    });
  }, [cases, filters]);

  return (
    <div>
      <div className="filters">
        {/* Add inputs/selects for each filter */}
        <input
          name="caseNumber"
          value={filters.caseNumber}
          onChange={handleFilterChange}
          placeholder="Filter by case number"
        />
        {/* Add more filter inputs as needed */}
      </div>
      <table className="case-details-table">
        <thead>
          <tr>
            <th>Case Number</th>
            <th>Status</th>
            <th>Hotel</th>
            <th>Victims Count</th>
            <th>Investigating Officer</th>
          </tr>
        </thead>
        <tbody>
          {filteredCases.map((caseDetail) => (
            <tr key={caseDetail.id}>
              <td>{caseDetail.name}</td>
              <td>{caseDetail.status}</td>
              <td>{caseDetail.location}</td>
              <td>{caseDetail.victimsCount}</td>
              <td>{caseDetail.officer}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CaseDetailsList;

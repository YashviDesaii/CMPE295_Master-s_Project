import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from './firebase';
import NavigationMenu from './Navbar';
import CaseDetailsList from './CaseDetailsList';
import { collection, query, getDocs } from 'firebase/firestore';
import './CaseManagement.css';

const CaseManagement = () => {
    const [cases, setCases] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [casesPerPage] = useState(10);
    const [filterStatus, setFilterStatus] = useState('');
    const [filterOfficer, setFilterOfficer] = useState('');
    const [filterHotel, setFilterHotel] = useState('');

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

    const filteredCases = cases.filter(caseDetail => (
        (filterStatus ? caseDetail.status === filterStatus : true) &&
        (filterOfficer ? caseDetail.reportingOfficer === filterOfficer : true) &&
        (filterHotel ? caseDetail.departmentLocation === filterHotel : true)
    ));

    const indexOfLastCase = currentPage * casesPerPage;
    const indexOfFirstCase = indexOfLastCase - casesPerPage;
    const currentCases = filteredCases.slice(indexOfFirstCase, indexOfLastCase);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="case-management-container">
            <header className="header">
                <NavigationMenu />
            </header>
            <h1>Manage Your Cases</h1>

            <div className="filters">
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Resolved">Resolved</option>
                </select>
                <select value={filterOfficer} onChange={(e) => setFilterOfficer(e.target.value)}>
                    <option value="">All Officers</option>
                    {/* Dynamically list officers from cases or a predefined list */}
                    {cases.map((caseDetail, index) => (
                        <option key={index} value={caseDetail.reportingOfficer}>{caseDetail.reportingOfficer}</option>
                    ))}
                </select>
                <select value={filterHotel} onChange={(e) => setFilterHotel(e.target.value)}>
                    <option value="">All Hotels</option>
                    {/* Dynamically list hotels from cases or a predefined list */}
                    {cases.map((caseDetail, index) => (
                        <option key={index} value={caseDetail.departmentLocation}>{caseDetail.departmentLocation}</option>
                    ))}
                </select>
            </div>

            <CaseDetailsList
                cases={currentCases}
                paginate={paginate}
                currentPage={currentPage}
                totalCases={filteredCases.length}
                casesPerPage={casesPerPage}
            />
        </div>
    );
}

export default CaseManagement;

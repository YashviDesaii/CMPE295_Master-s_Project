import React from 'react';
import './CaseDetailsList.css';
import { db } from './firebase';
import { doc, updateDoc } from 'firebase/firestore';

const CaseDetailsList = ({ cases, paginate, currentPage, totalCases, casesPerPage }) => {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalCases / casesPerPage); i++) {
        pageNumbers.push(i);
    }

    const handleStatusChange = async (caseId, newStatus) => {
        const caseRef = doc(db, 'policeReports', caseId);
        await updateDoc(caseRef, {
            status: newStatus
        });
    };

    return (
        <div>
            <table className="case-details-table">
                <thead>
                    <tr>
                        <th>Case Number</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Hotel</th>
                        <th>Victims Count</th>
                        <th>Investigating Officer</th>
                    </tr>
                </thead>
                <tbody>
                    {cases.map(caseDetail => (
                        <tr key={caseDetail.id}>
                            <td>{caseDetail.caseNumber}</td>
                            <td>{caseDetail.caseDescription}</td>
                            <td>
                                <select
                                    defaultValue={caseDetail.status}
                                    onChange={(e) => handleStatusChange(caseDetail.id, e.target.value)}
                                >
                                    <option value="Active">Active</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Resolved">Resolved</option>
                                </select>
                            </td>
                            <td>{caseDetail.departmentLocation}</td>
                            <td>{caseDetail.victimCount}</td>
                            <td>{caseDetail.reportingOfficer}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                {pageNumbers.map(number => (
                    <button key={number} onClick={() => paginate(number)}>
                        {number}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CaseDetailsList;

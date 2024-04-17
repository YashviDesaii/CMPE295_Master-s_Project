import React from 'react';
import {
  BrowserRouter as Router,
  Routes, // Use 'Routes' instead of 'Switch'
  Route,
  Link
} from 'react-router-dom';
import HotelMatch from './HotelMatch';
import Hotel from './Hotel';
import PoliceReportForm from './PoliceReport';
import CaseManagement from './CaseManagement';
import HumanTraffickingPortal from './HumanTraffickingPortal';
import Dashboard from './Dashboard';

// Import other components you might have
// import Home from './Home';
// import Cases from './Cases';

function App() {
  return (
    <Router>
      <div>
        {/* Your site's navigation */}
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/hotel-match">Hotel Match</Link>
            </li>
            <li>
              <Link to="/hotels">Hotels</Link>
            </li>
            <li>
              <Link to="/police-report">File a Report</Link>
            </li>
            <li>
              <Link to="/case-management">Case Management</Link>
            </li>
            <li>
              <Link to="/human-trafficking">HumanTraffickingPortal</Link>
            </li>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
          </ul>
        </nav>

        {/* 'Routes' replaces 'Switch' and is used to define route configurations */}
        <Routes>
          <Route path="/hotel-match" element={<HotelMatch />} />
          <Route path="/hotels" element={<Hotel />} />
          <Route path="/police-report" element={<PoliceReportForm />} />
          <Route path="/case-management" element={<CaseManagement />} />
          <Route path="/human-trafficking" element={<HumanTraffickingPortal />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Define other routes and their corresponding components as elements */}
          {/* <Route path="/cases" element={<Cases />} />
          <Route path="/" element={<Home />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

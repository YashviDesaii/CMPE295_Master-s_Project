import React, {useState} from 'react';
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
import './App.css'
import SignIn from './SignIn';
import SignUp from './SignUp';

function App() {

  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Router>
      <div>
        {/* 'Routes' replaces 'Switch' and is used to define route configurations */}
        <Routes>
          <Route path="/hotel-match" element={<HotelMatch />} />
          <Route path="/hotels" element={<Hotel />} />
          <Route path="/police-report" element={<PoliceReportForm />} />
          <Route path="/case-management" element={<CaseManagement />} />
          <Route path="/map-view" element={<HumanTraffickingPortal />} />
          <Route path="/home" element={<Dashboard />} />
          <Route path="/" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

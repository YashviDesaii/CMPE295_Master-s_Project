import React, { useState,  useRef, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';


function NavigationMenu() {
  return (
    <>
      <Navbar bg="dark" className="justify-content-center" >
          <Nav className="container-fluid">
            <Nav.Link href="/home">Dashboard</Nav.Link>
            <Nav.Link href="/police-report">File a Report</Nav.Link>
            <Nav.Link href="/hotels">Hotels</Nav.Link>
            <Nav.Link href="/case-management">Cases</Nav.Link>
            <Nav.Link href="/map-view">Map View</Nav.Link>
            <Nav.Link className="navbar-right" href="/">Log Out</Nav.Link>
             {/* Log Out link on the right */}
          </Nav>
      </Navbar>
    </>
  );
}

export default NavigationMenu;

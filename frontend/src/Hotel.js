import React from 'react';
import './Hotel.css';
import NavigationMenu from './Navbar';

function Hotel() {
  return (
    <div className="hotel">
      <header className="header">
        <NavigationMenu/>
      </header>
      <main className="main-content">
        <section className="hotel-info">
          <h1>Hotel Information</h1>
          <div className="hotel-details">
            <h2>Hotel Details</h2>
            <p>Here are the details of the hotel you selected:</p>
            <div className="detail-group">
              <div className="detail">
                <label>Hotel Name</label>
                <div className="value">Hotel ABC</div>
              </div>
              <div className="detail">
                <label>Location</label>
                <div className="value">123 Main St, City, State</div>
              </div>
            </div>
          </div>
          <div className="hotel-images">
            <h2>Images</h2>
            <div className="images-group">
              <img src="placeholder.jpeg" alt="Room photo 1" />
              <img src="placeholder.jpeg" alt="Room photo 2" />
              <img src="placeholder.jpeg" alt="Room photo 3" />
            </div>
          </div>
        </section>
        <section className="related-cases">
          <h2>Related Cases</h2>
          <div className="cases-group">
            <div className="case">Case 1<br/>Case description 1</div>
            <div className="case">Case 2<br/>Case description 2</div>
            <div className="case">Case 3<br/>Case description 3</div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Hotel;

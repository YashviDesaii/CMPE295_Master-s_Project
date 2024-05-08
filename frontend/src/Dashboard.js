import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import NavigationMenu from './Navbar'; 
import { db } from './firebase';
import { collection, query, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

const Dashboard = () => {
  const [policeReports, setPoliceReports] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [statusCounts, setStatusCounts] = useState({});
  const [dateCounts, setDateCounts] = useState({});
  const [hotelCaseCounts, setHotelCaseCounts] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const reportSnapshot = await getDocs(collection(db, 'policeReports'));
      const hotelSnapshot = await getDocs(collection(db, 'hotels'));
      
      const fetchedReports = reportSnapshot.docs.map(doc => doc.data());
      const fetchedHotels = hotelSnapshot.docs.map(doc => ({
        name: doc.data().ID,
        cases: doc.data().relatedCases.length,
      }));

      const statusCounter = {};
      const dateCounter = {};
      const hotelCases = {};

      fetchedReports.forEach(report => {
        statusCounter[report.status] = (statusCounter[report.status] || 0) + 1;
        dateCounter[report.caseDate] = (dateCounter[report.caseDate] || 0) + 1;
      });

      fetchedHotels.forEach(hotel => {
        hotelCases[hotel.name] = hotel.cases;
      });

      setPoliceReports(fetchedReports);
      setHotels(fetchedHotels);
      setStatusCounts(statusCounter);
      setDateCounts(dateCounter);
      setHotelCaseCounts(hotelCases);
    };

    fetchData();
  }, []);

  const pieChartData = {
    labels: Object.keys(statusCounts),
    datasets: [{
      data: Object.values(statusCounts),
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)',
        'rgba(255, 159, 64, 0.5)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 1
    }]
  };

  const pieChartOptions = {
    plugins: {
      legend: {
        position: 'top',
      }
    },
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2, 
  };

  const barChartOptions = {
    scales: {
      y: {
        beginAtZero: true,
      }
    },
    plugins: {
      legend: {
        display: false
      }
    },
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2, 
  };

  const barChartData = {
    labels: Object.keys(dateCounts),
    datasets: [{
      label: 'Cases Reported Each Day',
      data: Object.values(dateCounts),
      backgroundColor: 'rgba(50, 150, 150, 0.5)',
      borderColor: 'rgba(75, 92, 92, 0.8)',
      borderWidth: 1,
    }]
  };

  const hotelBarChartData = {
    labels: Object.keys(hotelCaseCounts),
    datasets: [{
      label: 'Number of Cases per Hotel',
      data: Object.values(hotelCaseCounts),
      backgroundColor: 'rgba(132, 99, 255, 0.5)',
      borderColor: 'rgba(132, 99, 255, 1)',
      borderWidth: 1
    }]
  };

  const Header = () => (
    <header className="header">
      <NavigationMenu/>
      <div className="logo">Law Enforcement Portal</div>
    </header>
  );

  const WelcomeBanner = () => (
    <section className="welcome-banner">
      <h1>Combat Human Trafficking</h1>
      <p>If you see something, say something. Prevent Human Trafficking</p>
      <div className="actions">
        <Link to="/case-management">
          <button>View Your Cases</button>
        </Link>
        <Link to="/police-report">
          <button>Create Case</button>
        </Link>
      </div>
    </section>
  );

  const CaseMetrics = () => (
    <section className="case-metrics">
      {/* Add the respective metric components here */}
    </section>
  );

  const RecentUpdates = () => (
    <section className="recent-updates">Recent Updates</section>
  );

  const FeaturedTools = () => (
    <section className="featured-tools">Featured Tools</section>
  );

  const TopNewHotels = () => (
    <section className="top-new-hotels">Top New Hotels</section>
  );

  const UserProfile = () => (
    <section className="user-profile">User Profile</section>
  );

  const CommunityUpdates = () => (
    <section className="community-updates">Community Updates</section>
  );

  return (
    <div className="dashboard">
      <Header />
      <main>
        <WelcomeBanner />
        <div className="chart-section">
          <h3>Status of Cases</h3>
          <Pie data={pieChartData} options={pieChartOptions} />
        </div>
        <div className="chart-section">
          <h3>Cases Reported Each Day</h3>
          <Bar data={barChartData} options={barChartOptions} />
        </div>
        <div className="chart-section">
          <h3>Number of Cases per Hotel</h3>
          <Bar data={hotelBarChartData} options={barChartOptions} />
        </div>
        <div className="content">
          <CaseMetrics />
          <RecentUpdates />
          <FeaturedTools />
          <TopNewHotels />
          <UserProfile />
          <CommunityUpdates />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

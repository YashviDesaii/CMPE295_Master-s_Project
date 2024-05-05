import React , { useEffect, useState } from 'react';
import './Dashboard.css'; // Make sure to create a corresponding CSS file
import NavigationMenu from './Navbar'; 
import { db } from './firebase';
import { collection, query, getDocs, getDoc, doc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto'
import { Chart } from 'react-chartjs-2' 

const Dashboard = () => {
  const [policeReports, setPoliceReports] = useState([]);
  const [statusCounts, setStatusCounts] = useState({});
  const [dateCounts, setDateCounts] = useState({});

  useEffect(() => {
    const fetchPoliceReports = async () => {
      try {
        const policeReportsCollection = collection(db, 'policeReports');
        const q = query(policeReportsCollection)
        const snapshot = await getDocs(q);

        if(!snapshot.empty){
          const fetchedReports = snapshot.docs.map(doc => doc.data());
          setPoliceReports(fetchedReports);
          const statusCounter = {};
          const dateCounter = {}
          fetchedReports.forEach(report => {
            statusCounter[report.status] = (statusCounter[report.status] || 0) + 1;
            dateCounter[report.caseDate] = (dateCounter[report.caseDate] || 0) + 1;
          });
          setStatusCounts(statusCounter);
          setDateCounts(dateCounter);
        }
        
      } catch (error) {
        console.error('Error fetching police reports:', error);
      }

    };

    fetchPoliceReports();
  }, []);

  
  console.log(policeReports)
  
  const barChartData = {
    labels: Object.keys(dateCounts),
    datasets: [
      {
        label: 'Date',
        data: Object.values(dateCounts),
        backgroundColor: 'rgba(50, 150, 150, 0.5)',
        borderColor: 'rgba(75, 92, 92, 0.8)',
        borderWidth: 1,
        maxBarThickness: 40
      },
    ],
  };

  const barChartoptions = {
    scales: {
      x: {
        barPercentage: 0.6, // Adjust bar percentage to decrease bar width
        categoryPercentage: 0.8, // Adjust category percentage to decrease category width
      },
      y: {
        ticks: {
          stepSize: 1,          
          suggestedMin: 'min-int-value',      
          suggestedMax: 'max-int-value'       
        }
      }
    },
    plugins: {
      legend: {
        position: 'top', // Place the legend below the chart
      },
    },
  };

  const pieChartData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        // label: 'Status',
        data: Object.values(statusCounts),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)', // Red
          'rgba(54, 162, 235, 0.5)', // Blue
          'rgba(255, 205, 86, 0.5)', // Yellow
        ],
        borderWidth: 1,
      },
    ],
  };
  
  const pieChartoptions = {
    plugins: {
      legend: {
        position: 'top',
      },
    },
    elements: {
      arc: {
        borderWidth: 1, // Remove border from arcs
      },
    },
    radius: '80%', // Reduce the size of the Pie chart
  };
  
  const Header = () => {
    return (
      <header className="header">
        <NavigationMenu/>
        <div className="logo">Law Enforcement Portal</div>
      </header>
    );
  };

  const WelcomeBanner = () => {
    return (
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
  };

  const CaseMetrics = () => {
    return (
      <section className="case-metrics">
        {/* Add the respective metric components here */}
      </section>
    );
  };

  // Other component implementations...

  const Footer = () => {
    return (
      <footer className="footer">
        {/* Footer links and text */}
      </footer>
    );
  };

  // Additional components that need to be defined to clear the ESLint errors:

    const RecentUpdates = () => {
      // Placeholder content for the RecentUpdates component
      return <section className="recent-updates">Recent Updates</section>;
    };
    
    const FeaturedTools = () => {
      // Placeholder content for the FeaturedTools component
      return <section className="featured-tools">Featured Tools</section>;
    };
    
    const TopNewHotels = () => {
      // Placeholder content for the TopNewHotels component
      return <section className="top-new-hotels">Top New Hotels</section>;
    };
    
    const UserProfile = () => {
      // Placeholder content for the UserProfile component
      return <section className="user-profile">User Profile</section>;
    };
    
    const CommunityUpdates = () => {
      // Placeholder content for the CommunityUpdates component
      return <section className="community-updates">Community Updates</section>;
    };

    return (
      <div className="dashboard">
        <Header />
        <main>
          <WelcomeBanner />
          <div className="chart-container">
            <Pie data={pieChartData} options={pieChartoptions} />
            <Bar data={barChartData} options={barChartoptions} />
          </div>
          <div style={{ display: 'inline-block' }}>
            <p style={{ marginLeft: '350px' }}>Status of Cases</p>
            <p style={{ marginLeft: '950px'}}>Cases reported on each Day</p>
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
        <Footer />
      </div>
    );
  };
    
export default Dashboard;

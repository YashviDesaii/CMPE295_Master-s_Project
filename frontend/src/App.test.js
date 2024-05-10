import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

describe('App Component', () => {
  test('renders the SignIn component by default', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(screen.getByText(/Sign In/i)).toBeInTheDocument();
  });

  test('navigates to SignUp component when the route is /sign-up', () => {
    window.history.pushState({}, 'Sign Up', '/sign-up');
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
  });

  test('navigates to Dashboard component when the route is /home', () => {
    window.history.pushState({}, 'Dashboard', '/home');
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  });

  test('navigates to HotelMatch component when the route is /hotel-match', () => {
    window.history.pushState({}, 'Hotel Match', '/hotel-match');
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(screen.getByText(/Hotel Match/i)).toBeInTheDocument();
  });

  test('navigates to Hotel component when the route is /hotels', () => {
    window.history.pushState({}, 'Hotels', '/hotels');
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(screen.getByText(/Hotels/i)).toBeInTheDocument();
  });

  test('navigates to PoliceReportForm component when the route is /police-report', () => {
    window.history.pushState({}, 'Police Report', '/police-report');
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(screen.getByText(/Police Report/i)).toBeInTheDocument();
  });

  test('navigates to CaseManagement component when the route is /case-management', () => {
    window.history.pushState({}, 'Case Management', '/case-management');
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(screen.getByText(/Case Management/i)).toBeInTheDocument();
  });

  test('navigates to HumanTraffickingPortal component when the route is /map-view', () => {
    window.history.pushState({}, 'Map View', '/map-view');
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    expect(screen.getByText(/Human Trafficking Portal/i)).toBeInTheDocument();
  });
});

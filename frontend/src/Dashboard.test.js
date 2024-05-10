import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Dashboard from './Dashboard';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
import { BrowserRouter } from 'react-router-dom';

// Mock the necessary Firebase Firestore methods
jest.mock('./firebase', () => ({
  db: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
}));

jest.mock('./Navbar', () => () => <div>Navigation Menu</div>);

describe('Dashboard Component', () => {
  const mockPoliceReports = [
    { status: 'Active', caseDate: '2023-01-01' },
    { status: 'Resolved', caseDate: '2023-01-02' },
    { status: 'Pending', caseDate: '2023-01-03' },
  ];

  const mockHotels = [
    { ID: 'Hotel A', relatedCases: ['case1', 'case2'] },
    { ID: 'Hotel B', relatedCases: ['case3'] },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    getDocs.mockImplementation((collectionRef) => {
      const collectionName = collectionRef._query.path.segments[0];
      if (collectionName === 'policeReports') {
        return Promise.resolve({
          docs: mockPoliceReports.map((report) => ({
            data: () => report,
          })),
        });
      }
      if (collectionName === 'hotels') {
        return Promise.resolve({
          docs: mockHotels.map((hotel) => ({
            data: () => hotel,
          })),
        });
      }
      return Promise.resolve({ docs: [] });
    });
  });

  test('renders Dashboard component with navigation menu', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );
    });

    expect(screen.getByText('Navigation Menu')).toBeInTheDocument();
    expect(screen.getByText('Law Enforcement Portal')).toBeInTheDocument();
  });

  test('fetches and displays police reports and hotels data', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Status of Cases')).toBeInTheDocument();
      expect(screen.getByText('Cases Reported Each Day')).toBeInTheDocument();
      expect(screen.getByText('Number of Cases per Hotel')).toBeInTheDocument();
    });
  });

  test('renders pie chart for status counts', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Status of Cases')).toBeInTheDocument();
      const pieChartCanvas = screen.getByRole('img', { name: /Status of Cases/i });
      expect(pieChartCanvas).toBeInTheDocument();
    });
  });

  test('renders bar chart for cases reported each day', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Cases Reported Each Day')).toBeInTheDocument();
      const barChartCanvas = screen.getByRole('img', { name: /Cases Reported Each Day/i });
      expect(barChartCanvas).toBeInTheDocument();
    });
  });

  test('renders bar chart for number of cases per hotel', async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <Dashboard />
        </BrowserRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Number of Cases per Hotel')).toBeInTheDocument();
      const barChartCanvas = screen.getByRole('img', { name: /Number of Cases per Hotel/i });
      expect(barChartCanvas).toBeInTheDocument();
    });
  });
});

// src/tests/Dashboard.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Dashboard from './Dashboard';
import { MemoryRouter } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';

jest.mock('./firebase', () => ({
  db: {
    collection: jest.fn(),
  },
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
}));

describe('Dashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders Dashboard component', async () => {
    getDocs.mockResolvedValueOnce({
      docs: [
        { id: '1', data: () => ({ status: 'Active', caseDate: '2023-01-01' }) },
        { id: '2', data: () => ({ status: 'Pending', caseDate: '2023-01-02' }) },
      ],
    });

    getDocs.mockResolvedValueOnce({
      docs: [
        { id: '1', data: () => ({ ID: 'Hotel1', relatedCases: ['case1', 'case2'] }) },
        { id: '2', data: () => ({ ID: 'Hotel2', relatedCases: ['case3'] }) },
      ],
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    // Check if the main elements are rendered
    expect(screen.getByText(/Combat Human Trafficking/i)).toBeInTheDocument();
    expect(screen.getByText(/Prevent Human Trafficking/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /View Your Cases/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Case/i })).toBeInTheDocument();

    // Wait for data fetching and state updates
    await waitFor(() => {
      expect(screen.getByText(/Status of Cases/i)).toBeInTheDocument();
      expect(screen.getByText(/Cases Reported Each Day/i)).toBeInTheDocument();
      expect(screen.getByText(/Number of Cases per Hotel/i)).toBeInTheDocument();
    });

    // Check if the charts are rendered
    expect(screen.getByText(/Status of Cases/i)).toBeInTheDocument();
    expect(screen.getByText(/Cases Reported Each Day/i)).toBeInTheDocument();
    expect(screen.getByText(/Number of Cases per Hotel/i)).toBeInTheDocument();
  });

  test('fetches and displays data correctly', async () => {
    getDocs.mockResolvedValueOnce({
      docs: [
        { id: '1', data: () => ({ status: 'Active', caseDate: '2023-01-01' }) },
        { id: '2', data: () => ({ status: 'Pending', caseDate: '2023-01-02' }) },
      ],
    });

    getDocs.mockResolvedValueOnce({
      docs: [
        { id: '1', data: () => ({ ID: 'Hotel1', relatedCases: ['case1', 'case2'] }) },
        { id: '2', data: () => ({ ID: 'Hotel2', relatedCases: ['case3'] }) },
      ],
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    await waitFor(() => {
      // Check if the fetched data is processed correctly
      expect(screen.getByText(/Active/i)).toBeInTheDocument();
      expect(screen.getByText(/Pending/i)).toBeInTheDocument();
      expect(screen.getByText(/2023-01-01/i)).toBeInTheDocument();
      expect(screen.getByText(/2023-01-02/i)).toBeInTheDocument();
      expect(screen.getByText(/Hotel1/i)).toBeInTheDocument();
      expect(screen.getByText(/Hotel2/i)).toBeInTheDocument();
    });
  });
});

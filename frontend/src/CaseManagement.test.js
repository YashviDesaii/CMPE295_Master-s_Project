import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CaseManagement from './CaseManagement';
import { MemoryRouter } from 'react-router-dom';
import { collection, query, getDocs } from 'firebase/firestore';

// Mock the necessary Firebase Firestore methods
jest.mock('./firebase', () => ({
  db: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  getDocs: jest.fn(),
}));

describe('CaseManagement', () => {
  const mockCases = [
    {
      id: '1',
      caseNumber: '123',
      caseDescription: 'Test case 1',
      status: 'Active',
      departmentLocation: 'Hotel A',
      victimCount: 1,
      reportingOfficer: 'Officer A',
    },
    {
      id: '2',
      caseNumber: '456',
      caseDescription: 'Test case 2',
      status: 'Pending',
      departmentLocation: 'Hotel B',
      victimCount: 2,
      reportingOfficer: 'Officer B',
    },
    {
      id: '3',
      caseNumber: '789',
      caseDescription: 'Test case 3',
      status: 'Resolved',
      departmentLocation: 'Hotel C',
      victimCount: 3,
      reportingOfficer: 'Officer C',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    getDocs.mockResolvedValue({
      docs: mockCases.map((caseDetail) => ({
        id: caseDetail.id,
        data: () => caseDetail,
      })),
    });
  });

  test('renders CaseManagement component', () => {
    render(
      <MemoryRouter>
        <CaseManagement />
      </MemoryRouter>
    );

    expect(screen.getByText(/Manage Your Cases/i)).toBeInTheDocument();
  });

  test('fetches and displays cases', async () => {
    render(
      <MemoryRouter>
        <CaseManagement />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Test case 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Test case 2/i)).toBeInTheDocument();
      expect(screen.getByText(/Test case 3/i)).toBeInTheDocument();
    });
  });

  test('filters cases by status', async () => {
    render(
      <MemoryRouter>
        <CaseManagement />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Test case 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Test case 2/i)).toBeInTheDocument();
      expect(screen.getByText(/Test case 3/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Status'), {
      target: { value: 'Active' },
    });

    await waitFor(() => {
      expect(screen.queryByText(/Test case 2/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Test case 3/i)).not.toBeInTheDocument();
      expect(screen.getByText(/Test case 1/i)).toBeInTheDocument();
    });
  });

  test('filters cases by officer', async () => {
    render(
      <MemoryRouter>
        <CaseManagement />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Test case 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Test case 2/i)).toBeInTheDocument();
      expect(screen.getByText(/Test case 3/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Officer'), {
      target: { value: 'Officer A' },
    });

    await waitFor(() => {
      expect(screen.queryByText(/Test case 2/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Test case 3/i)).not.toBeInTheDocument();
      expect(screen.getByText(/Test case 1/i)).toBeInTheDocument();
    });
  });

  test('filters cases by hotel', async () => {
    render(
      <MemoryRouter>
        <CaseManagement />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Test case 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Test case 2/i)).toBeInTheDocument();
      expect(screen.getByText(/Test case 3/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Hotel'), {
      target: { value: 'Hotel A' },
    });

    await waitFor(() => {
      expect(screen.queryByText(/Test case 2/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Test case 3/i)).not.toBeInTheDocument();
      expect(screen.getByText(/Test case 1/i)).toBeInTheDocument();
    });
  });
});

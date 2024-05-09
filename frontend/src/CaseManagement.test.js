// src/tests/CaseManagement.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import CaseManagement from '../components/CaseManagement';
import { MemoryRouter } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, getDocs } from 'firebase/firestore';

jest.mock('../firebase', () => ({
  db: {
    collection: jest.fn(),
  },
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  getDocs: jest.fn(),
}));

describe('CaseManagement', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
    const mockCases = [
      {
        id: '1',
        caseNumber: '123',
        caseDescription: 'Test case 1',
        status: 'Active',
        departmentLocation: 'Location 1',
        victimCount: 1,
        reportingOfficer: 'Officer 1',
      },
      {
        id: '2',
        caseNumber: '456',
        caseDescription: 'Test case 2',
        status: 'Pending',
        departmentLocation: 'Location 2',
        victimCount: 2,
        reportingOfficer: 'Officer 2',
      },
    ];

    getDocs.mockResolvedValue({
      docs: mockCases.map((caseDetail) => ({
        id: caseDetail.id,
        data: () => caseDetail,
      })),
    });

    render(
      <MemoryRouter>
        <CaseManagement />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Test case 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Test case 2/i)).toBeInTheDocument();
    });
  });

  test('filters cases by status', async () => {
    const mockCases = [
      {
        id: '1',
        caseNumber: '123',
        caseDescription: 'Test case 1',
        status: 'Active',
        departmentLocation: 'Location 1',
        victimCount: 1,
        reportingOfficer: 'Officer 1',
      },
      {
        id: '2',
        caseNumber: '456',
        caseDescription: 'Test case 2',
        status: 'Pending',
        departmentLocation: 'Location 2',
        victimCount: 2,
        reportingOfficer: 'Officer 2',
      },
    ];

    getDocs.mockResolvedValue({
      docs: mockCases.map((caseDetail) => ({
        id: caseDetail.id,
        data: () => caseDetail,
      })),
    });

    render(
      <MemoryRouter>
        <CaseManagement />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Test case 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Test case 2/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Status'), {
      target: { value: 'Active' },
    });

    await waitFor(() => {
      expect(screen.queryByText(/Test case 2/i)).not.toBeInTheDocument();
      expect(screen.getByText(/Test case 1/i)).toBeInTheDocument();
    });
  });
});

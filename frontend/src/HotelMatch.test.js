// src/tests/HotelMatch.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import HotelMatch from './HotelMatch';
import { MemoryRouter } from 'react-router-dom';
import { collection, getDocs, addDoc, updateDoc, where, query } from 'firebase/firestore';
import { db } from './firebase';

jest.mock('./firebase', () => ({
  db: {
    collection: jest.fn(),
  },
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
}));

describe('HotelMatch', () => {
  const mockPredictionData = {
    hotelIds: ['1', '2'],
    probabilities: [0.8, 0.2],
  };
  const mockCaseId = 'case123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders HotelMatch component and displays hotel data', async () => {
    getDocs.mockImplementation((query) => {
      if (query._queryOptions._fieldFilters[0]._value === '1') {
        return Promise.resolve({
          empty: false,
          docs: [
            {
              id: '1',
              data: () => ({ ID: '1', relatedCases: [] }),
              ref: { id: '1' },
            },
          ],
        });
      } else if (query._queryOptions._fieldFilters[0]._value === '2') {
        return Promise.resolve({
          empty: true,
          docs: [],
        });
      }
    });

    render(
      <MemoryRouter initialEntries={[{ state: { predictionData: mockPredictionData, caseId: mockCaseId } }]}>
        <HotelMatch />
      </MemoryRouter>
    );

    // Check if the loading message is displayed
    expect(screen.getByText(/Loading hotel details/i)).toBeInTheDocument();

    await waitFor(() => {
      // Check if the hotel data is displayed
      expect(screen.getByText(/Hotel Details/i)).toBeInTheDocument();
      expect(screen.getByText(/ID: 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Match Probability: 80.00%/i)).toBeInTheDocument();
      expect(screen.getByText(/ID: 2/i)).toBeInTheDocument();
      expect(screen.getByText(/Match Probability: 20.00%/i)).toBeInTheDocument();
    });
  });

  test('handles adding a new hotel entry', async () => {
    getDocs.mockImplementation((query) => {
      if (query._queryOptions._fieldFilters[0]._value === '1') {
        return Promise.resolve({
          empty: true,
          docs: [],
        });
      }
    });

    addDoc.mockResolvedValueOnce({ id: 'new-hotel-id' });

    render(
      <MemoryRouter initialEntries={[{ state: { predictionData: mockPredictionData, caseId: mockCaseId } }]}>
        <HotelMatch />
      </MemoryRouter>
    );

    await waitFor(() => {
      // Check if the hotel data is displayed
      expect(screen.getByText(/Hotel Details/i)).toBeInTheDocument();
      expect(screen.getByText(/ID: 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Match Probability: 80.00%/i)).toBeInTheDocument();
    });
  });

  test('handles updating an existing hotel entry', async () => {
    getDocs.mockImplementation((query) => {
      if (query._queryOptions._fieldFilters[0]._value === '1') {
        return Promise.resolve({
          empty: false,
          docs: [
            {
              id: '1',
              data: () => ({ ID: '1', relatedCases: [] }),
              ref: { id: '1' },
            },
          ],
        });
      }
    });

    updateDoc.mockResolvedValueOnce({});

    render(
      <MemoryRouter initialEntries={[{ state: { predictionData: mockPredictionData, caseId: mockCaseId } }]}>
        <HotelMatch />
      </MemoryRouter>
    );

    await waitFor(() => {
      // Check if the hotel data is displayed
      expect(screen.getByText(/Hotel Details/i)).toBeInTheDocument();
      expect(screen.getByText(/ID: 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Match Probability: 80.00%/i)).toBeInTheDocument();
    });
  });

  test('displays an error message if data fetching fails', async () => {
    getDocs.mockRejectedValueOnce(new Error('Failed to fetch'));

    render(
      <MemoryRouter initialEntries={[{ state: { predictionData: mockPredictionData, caseId: mockCaseId } }]}>
        <HotelMatch />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch hotel details/i)).toBeInTheDocument();
    });
  });
});

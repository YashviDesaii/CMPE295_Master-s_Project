import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { useLocation } from 'react-router-dom';
import HotelMatch from './HotelMatch';
import { db } from './firebase';
import { collection, query, where, getDocs, addDoc, updateDoc } from 'firebase/firestore';

// Mock the necessary Firebase Firestore methods
jest.mock('./firebase', () => ({
  db: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));

jest.mock('./Navbar', () => () => <div>Navigation Menu</div>);

describe('HotelMatch Component', () => {
  const mockPredictionData = {
    hotelIds: ['hotel1', 'hotel2'],
    probabilities: [0.8, 0.2],
  };

  const mockCaseId = 'case123';

  const mockHotelDocs = [
    {
      id: 'hotel1',
      data: () => ({ ID: 'hotel1', relatedCases: [] }),
    },
    {
      id: 'hotel2',
      data: () => ({ ID: 'hotel2', relatedCases: [] }),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    useLocation.mockReturnValue({
      state: {
        predictionData: mockPredictionData,
        caseId: mockCaseId,
      },
    });

    getDocs.mockResolvedValue({ docs: mockHotelDocs });
    addDoc.mockResolvedValue({ id: 'newHotelDocId' });
    updateDoc.mockResolvedValue(undefined);
  });



  test('displays loading message when hotel data is being fetched', async () => {
    getDocs.mockResolvedValueOnce({ docs: [] });

    render(<HotelMatch />);

    expect(screen.getByText(/Loading hotel details.../)).toBeInTheDocument();
  });

  test('handles no prediction data gracefully', async () => {
    useLocation.mockReturnValueOnce({
      state: {},
    });

    render(<HotelMatch />);

    expect(screen.getByText(/Loading hotel details.../)).toBeInTheDocument();
  });




});

// src/tests/Hotel.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Hotel from './Hotel';
import { MemoryRouter } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';

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
}));

describe('Hotel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders Hotel component', async () => {
    getDocs.mockResolvedValueOnce({
      docs: [
        { id: '1', data: () => ({ ID: '1', image1: 'image1.jpg', relatedCases: ['case1', 'case2'] }) },
        { id: '2', data: () => ({ ID: '2', image1: 'image2.jpg', relatedCases: ['case3'] }) },
      ],
    });

    render(
      <MemoryRouter>
        <Hotel />
      </MemoryRouter>
    );

    // Check if the main elements are rendered
    expect(screen.getByText(/Please select a hotel from the dropdown/i)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();

    // Wait for data fetching and state updates
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });

  test('fetches and displays hotels data correctly', async () => {
    getDocs.mockResolvedValueOnce({
      docs: [
        { id: '1', data: () => ({ ID: '1', image1: 'image1.jpg', relatedCases: ['case1', 'case2'] }) },
        { id: '2', data: () => ({ ID: '2', image1: 'image2.jpg', relatedCases: ['case3'] }) },
      ],
    });

    render(
      <MemoryRouter>
        <Hotel />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });

  test('handles hotel selection and displays selected hotel data', async () => {
    getDocs.mockResolvedValueOnce({
      docs: [
        { id: '1', data: () => ({ ID: '1', image1: 'image1.jpg', relatedCases: ['case1', 'case2'] }) },
        { id: '2', data: () => ({ ID: '2', image1: 'image2.jpg', relatedCases: ['case3'] }) },
      ],
    });

    getDocs.mockResolvedValueOnce({
      docs: [
        { id: '1', data: () => ({ ID: '1', image1: 'image1.jpg', relatedCases: ['case1', 'case2'] }) },
      ],
    });

    render(
      <MemoryRouter>
        <Hotel />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByRole('combobox'), { target: { value: '1' } });

    await waitFor(() => {
      expect(screen.getByText(/Selected Hotel ID: 1/i)).toBeInTheDocument();
      expect(screen.getByText(/case1/i)).toBeInTheDocument();
      expect(screen.getByText(/case2/i)).toBeInTheDocument();
      expect(screen.getByAltText(/Hotel photo/i)).toBeInTheDocument();
    });
  });

  test('displays no data message when no related cases or image available', async () => {
    getDocs.mockResolvedValueOnce({
      docs: [
        { id: '1', data: () => ({ ID: '1', image1: null, relatedCases: [] }) },
      ],
    });

    render(
      <MemoryRouter>
        <Hotel />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByRole('combobox'), { target: { value: '1' } });

    await waitFor(() => {
      expect(screen.getByText(/Selected Hotel ID: 1/i)).toBeInTheDocument();
      expect(screen.getByText(/No image available/i)).toBeInTheDocument();
      expect(screen.getByText(/No related cases/i)).toBeInTheDocument();
    });
  });
});

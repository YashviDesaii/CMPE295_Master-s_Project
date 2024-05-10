import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import HumanTraffickingPortal from './HumanTraffickingPortal';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div>{children}</div>,
  TileLayer: () => <div>TileLayer</div>,
  useMap: () => ({
    eachLayer: jest.fn(),
    removeLayer: jest.fn(),
    addTo: jest.fn(),
  }),
}));

jest.mock('leaflet', () => {
  const Leaflet = jest.requireActual('leaflet');
  return {
    ...Leaflet,
    marker: jest.fn(() => ({
      addTo: jest.fn().mockReturnThis(),
      bindPopup: jest.fn().mockReturnThis(),
    })),
    heatLayer: jest.fn(() => ({
      addTo: jest.fn(),
      remove: jest.fn(),
    })),
    icon: jest.fn(),
  };
});

jest.mock('firebase/firestore', () => ({
  getDocs: jest.fn(),
  collection: jest.fn(),
}));

jest.mock('./firebase', () => ({
  db: {},
}));

jest.mock('./Navbar', () => () => <div>Navigation Menu</div>);

describe('HumanTraffickingPortal Component', () => {
  beforeEach(() => {
    getDocs.mockResolvedValue({
      docs: [
        { data: () => ({ departmentLocation: 'Location A' }) },
        { data: () => ({ departmentLocation: 'Location B' }) },
      ],
    });
  });

  test('renders the component and displays fetched data', async () => {
    render(
      <BrowserRouter>
        <HumanTraffickingPortal />
      </BrowserRouter>
    );

    expect(screen.getByText('Navigation Menu')).toBeInTheDocument();
    expect(screen.getByText('Cases Summary')).toBeInTheDocument();
    expect(screen.getByText('Total Crime:')).toBeInTheDocument();
    expect(screen.getByText('Total Human Trafficking cases:')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Total Crime: 0')).toBeInTheDocument();
      expect(screen.getByText('Total Human Trafficking cases: 2')).toBeInTheDocument();
    });
  });
});

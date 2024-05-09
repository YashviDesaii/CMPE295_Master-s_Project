// src/tests/PoliceReport.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import PoliceReportForm from './PoliceReport';
import { MemoryRouter } from 'react-router-dom';
import { db, storage } from './firebase';

import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

jest.mock('./firebase', () => {
  const originalModule = jest.requireActual('./firebase');
  return {
    ...originalModule,
    db: { collection: jest.fn() },
    storage: { ref: jest.fn() }
  };
});

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
}));

jest.mock("firebase/storage", () => ({
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(),
}));

jest.mock('axios');

describe('PoliceReportForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders PoliceReportForm component', () => {
    render(
      <MemoryRouter>
        <PoliceReportForm />
      </MemoryRouter>
    );

    expect(screen.getByText(/New Police Report/i)).toBeInTheDocument();
  });

  test('handles form input changes', () => {
    render(
      <MemoryRouter>
        <PoliceReportForm />
      </MemoryRouter>
    );

    userEvent.type(screen.getByLabelText(/Reporting Officer/i), 'John Doe');
    userEvent.type(screen.getByLabelText(/Police Department Location/i), 'Downtown');
    userEvent.type(screen.getByLabelText(/Case Description/i), 'Description of the case');
    userEvent.type(screen.getByLabelText(/Victim Count/i), '3');

    expect(screen.getByLabelText(/Reporting Officer/i)).toHaveValue('John Doe');
    expect(screen.getByLabelText(/Police Department Location/i)).toHaveValue('Downtown');
    expect(screen.getByLabelText(/Case Description/i)).toHaveValue('Description of the case');
    expect(screen.getByLabelText(/Victim Count/i)).toHaveValue('3');
  });

  test('submits the form and calls Firebase functions', async () => {
    addDoc.mockResolvedValue({ id: '123' });
    uploadBytes.mockResolvedValue({});
    getDownloadURL.mockResolvedValue('http://fakeurl.com/image.png');

    render(
      <MemoryRouter>
        <PoliceReportForm />
      </MemoryRouter>
    );

    userEvent.type(screen.getByLabelText(/Reporting Officer/i), 'John Doe');
    userEvent.type(screen.getByLabelText(/Police Department Location/i), 'Downtown');
    userEvent.type(screen.getByLabelText(/Case Description/i), 'Description of the case');
    userEvent.type(screen.getByLabelText(/Victim Count/i), '3');

    const file = new File(['image'], 'image.png', { type: 'image/png' });
    const inputFile = screen.getByLabelText(/Image/i);
    userEvent.upload(inputFile, file);

    const submitButton = screen.getByText(/Submit/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(addDoc).toHaveBeenCalled();
      expect(uploadBytes).toHaveBeenCalled();
      expect(getDownloadURL).toHaveBeenCalled();
    });
  });
});

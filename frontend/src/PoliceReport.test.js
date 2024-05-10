import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import PoliceReportForm from './PoliceReport';
import { db, storage } from './firebase';
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import axios from 'axios';

jest.mock('firebase/firestore', () => ({
  addDoc: jest.fn(),
  collection: jest.fn(),
}));

jest.mock('firebase/storage', () => ({
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(),
}));

jest.mock('axios');

jest.mock('./Navbar', () => () => <div>Navigation Menu</div>);

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

describe('PoliceReportForm Component', () => {
  beforeEach(() => {
    addDoc.mockClear();
    uploadBytes.mockClear();
    getDownloadURL.mockClear();
    axios.post.mockClear();
  });

  test('renders the component correctly', () => {
    render(
      <BrowserRouter>
        <PoliceReportForm />
      </BrowserRouter>
    );

    expect(screen.getByText('Navigation Menu')).toBeInTheDocument();
    expect(screen.getByText('New Police Report')).toBeInTheDocument();
    expect(screen.getByLabelText('Reporting Officer')).toBeInTheDocument();
    expect(screen.getByLabelText('Police Department Location')).toBeInTheDocument();
    expect(screen.getByLabelText('Case Description')).toBeInTheDocument();
    expect(screen.getByLabelText('Victim Count')).toBeInTheDocument();
    expect(screen.getByLabelText('Image')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  test('handles form input correctly', () => {
    render(
      <BrowserRouter>
        <PoliceReportForm />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText('Reporting Officer'), { target: { value: 'Officer John' } });
    fireEvent.change(screen.getByLabelText('Police Department Location'), { target: { value: 'Station A' } });
    fireEvent.change(screen.getByLabelText('Case Description'), { target: { value: 'Description of the case' } });
    fireEvent.change(screen.getByLabelText('Victim Count'), { target: { value: '3' } });

    expect(screen.getByLabelText('Reporting Officer').value).toBe('Officer John');
    expect(screen.getByLabelText('Police Department Location').value).toBe('Station A');
    expect(screen.getByLabelText('Case Description').value).toBe('Description of the case');
    expect(screen.getByLabelText('Victim Count').value).toBe('3');
  });

  test('submits the form successfully', async () => {
    addDoc.mockResolvedValue({ id: '12345' });
    uploadBytes.mockResolvedValue({ ref: {} });
    getDownloadURL.mockResolvedValue('http://image.url');
    axios.post.mockResolvedValue({ data: { prediction: 'success' } });

    render(
      <BrowserRouter>
        <PoliceReportForm />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText('Reporting Officer'), { target: { value: 'Officer John' } });
    fireEvent.change(screen.getByLabelText('Police Department Location'), { target: { value: 'Station A' } });
    fireEvent.change(screen.getByLabelText('Case Description'), { target: { value: 'Description of the case' } });
    fireEvent.change(screen.getByLabelText('Victim Count'), { target: { value: '3' } });

    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
    fireEvent.change(screen.getByLabelText('Image'), { target: { files: [file] } });

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(addDoc).toHaveBeenCalled();
      expect(uploadBytes).toHaveBeenCalled();
      expect(getDownloadURL).toHaveBeenCalled();
      expect(axios.post).toHaveBeenCalled();
    });
  });

  test('displays an error message if the image upload fails', async () => {
    uploadBytes.mockRejectedValue(new Error('Upload failed'));

    render(
      <BrowserRouter>
        <PoliceReportForm />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText('Reporting Officer'), { target: { value: 'Officer John' } });
    fireEvent.change(screen.getByLabelText('Police Department Location'), { target: { value: 'Station A' } });
    fireEvent.change(screen.getByLabelText('Case Description'), { target: { value: 'Description of the case' } });
    fireEvent.change(screen.getByLabelText('Victim Count'), { target: { value: '3' } });

    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
    fireEvent.change(screen.getByLabelText('Image'), { target: { files: [file] } });

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(screen.getByText('Failed to upload image, please try again.')).toBeInTheDocument();
    });
  });
});

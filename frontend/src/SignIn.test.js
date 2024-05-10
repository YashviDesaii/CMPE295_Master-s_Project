// src/tests/SignIn.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import SignIn from './SignIn';
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

describe('SignIn', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders SignIn component', () => {
    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /Sign In/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
  });



  test('handles input changes', () => {
    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'password' } });

    expect(screen.getByPlaceholderText(/Username/i)).toHaveValue('testuser');
    expect(screen.getByPlaceholderText(/Password/i)).toHaveValue('password');
  });

  test('submits the form and logs in successfully', async () => {
    getDocs.mockResolvedValue({
      forEach: (callback) => {
        callback({
          id: '1',
          data: () => ({ username: 'testuser', password: 'password' }),
        });
      },
    });

    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'password' } });

    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(screen.queryByText(/Login failed. Please check your credentials./i)).not.toBeInTheDocument();
      expect(screen.queryByRole('heading', { name: /Sign In/i })).not.toBeInTheDocument();
    });
  });
  test('shows error message on invalid credentials', async () => {
    getDocs.mockResolvedValue({
      docs: [
        {
          id: '1',
          data: () => ({ username: 'testuser', password: 'wrongpassword' }),
        },
      ],
    });

    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'password' } });

    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(screen.getByText(/Login failed. Please check your credentials./i)).toBeInTheDocument();
    });
  });
});

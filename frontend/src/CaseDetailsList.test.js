// src/tests/CaseDetailsList.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import CaseDetailsList from './CaseDetailsList';
import { db } from './firebase';
import { doc, updateDoc } from 'firebase/firestore';

jest.mock('./firebase', () => ({
  db: {
    collection: jest.fn(),
  },
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  updateDoc: jest.fn(),
}));

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

describe('CaseDetailsList', () => {
  test('renders CaseDetailsList component', () => {
    render(
      <CaseDetailsList
        cases={mockCases}
        paginate={jest.fn()}
        currentPage={1}
        totalCases={2}
        casesPerPage={10}
      />
    );

    expect(screen.getByText(/Test case 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Test case 2/i)).toBeInTheDocument();
  });

  test('handles status change', async () => {
    render(
      <CaseDetailsList
        cases={mockCases}
        paginate={jest.fn()}
        currentPage={1}
        totalCases={2}
        casesPerPage={10}
      />
    );

    fireEvent.change(screen.getByDisplayValue('Active'), {
      target: { value: 'Pending' },
    });

    expect(updateDoc).toHaveBeenCalled();
  });

  test('pagination works', () => {
    const paginate = jest.fn();

    render(
      <CaseDetailsList
        cases={mockCases}
        paginate={paginate}
        currentPage={1}
        totalCases={20}
        casesPerPage={10}
      />
    );

    const paginationButtons = screen.getAllByText('2');
    fireEvent.click(paginationButtons[1]);
    expect(paginate).toHaveBeenCalledWith(2);
  });
});

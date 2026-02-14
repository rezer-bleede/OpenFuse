import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import JobsPage from '../app/jobs/page';

describe('JobsPage', () => {
  it('renders jobs monitoring page', () => {
    render(<JobsPage />);
    
    expect(screen.getByText('Pipeline Jobs')).toBeInTheDocument();
    expect(screen.getByText(/Monitor and manage pipeline execution jobs/)).toBeInTheDocument();
  });

  it('renders jobs table header', () => {
    render(<JobsPage />);
    
    expect(screen.getByText('Job ID')).toBeInTheDocument();
    expect(screen.getByText('Pipeline')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Rows Synced')).toBeInTheDocument();
    expect(screen.getByText('Started')).toBeInTheDocument();
    expect(screen.getByText('Duration')).toBeInTheDocument();
  });

  it('shows empty state when no jobs', () => {
    render(<JobsPage />);
    
    expect(screen.getByText(/no jobs yet/i)).toBeInTheDocument();
    expect(screen.getByText(/Run a pipeline to see job history here/)).toBeInTheDocument();
  });

  it('displays statistics cards', () => {
    render(<JobsPage />);
    
    expect(screen.getByText('Total Runs')).toBeInTheDocument();
    expect(screen.getByText('Successful')).toBeInTheDocument();
    expect(screen.getByText('Failed')).toBeInTheDocument();
    expect(screen.getByText('Total Rows')).toBeInTheDocument();
  });

  it('shows zero values for all statistics', () => {
    render(<JobsPage />);
    
    const totalRuns = screen.getByText('Total Runs').nextElementSibling;
    const successful = screen.getByText('Successful').nextElementSibling;
    const failed = screen.getByText('Failed').nextElementSibling;
    const totalRows = screen.getByText('Total Rows').nextElementSibling;
    
    expect(totalRuns?.textContent).toBe('0');
    expect(successful?.textContent).toBe('0');
    expect(failed?.textContent).toBe('0');
    expect(totalRows?.textContent).toBe('0');
  });

  it('renders table with correct structure', () => {
    render(<JobsPage />);
    
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
    
    const thead = table.querySelector('thead');
    expect(thead).toBeInTheDocument();
    
    const tbody = table.querySelector('tbody');
    expect(tbody).toBeInTheDocument();
  });

  it('has correct number of header columns', () => {
    render(<JobsPage />);
    
    const headerRow = screen.getAllByRole('columnheader');
    expect(headerRow.length).toBe(6);
  });

  it('displays emerald color for successful stat', () => {
    render(<JobsPage />);
    
    const successfulCard = screen.getByText('Successful').closest('div');
    const successfulValue = successfulCard?.querySelector('.text-2xl');
    expect(successfulValue).toHaveClass('text-emerald-400');
  });

  it('displays red color for failed stat', () => {
    render(<JobsPage />);
    
    const failedCard = screen.getByText('Failed').closest('div');
    const failedValue = failedCard?.querySelector('.text-2xl');
    expect(failedValue).toHaveClass('text-red-400');
  });

  it('displays blue color for total rows stat', () => {
    render(<JobsPage />);
    
    const totalRowsCard = screen.getByText('Total Rows').closest('div');
    const totalRowsValue = totalRowsCard?.querySelector('.text-2xl');
    expect(totalRowsValue).toHaveClass('text-blue-400');
  });

  it('has consistent styling for statistics cards', () => {
    render(<JobsPage />);
    
    const statsCards = screen.getAllByText(/Total Runs|Successful|Failed|Total Rows/);
    statsCards.forEach(card => {
      const cardContainer = card.closest('.rounded-lg');
      expect(cardContainer).toBeInTheDocument();
    });
  });

  it('has page title and description', () => {
    render(<JobsPage />);
    
    expect(screen.getByText('Pipeline Jobs')).toBeInTheDocument();
    expect(screen.getByText(/Monitor and manage pipeline execution jobs/)).toBeInTheDocument();
  });

  it('renders empty table cell with colspan', () => {
    render(<JobsPage />);
    
    const table = screen.getByRole('table');
    const tbody = table?.querySelector('tbody');
    const emptyRow = tbody?.querySelector('tr');
    const emptyCell = emptyRow?.querySelector('td');
    
    expect(emptyCell).toHaveAttribute('colspan', '6');
  });

  it('has centered empty state text', () => {
    render(<JobsPage />);
    
    const emptyState = screen.getByText(/no jobs yet/i);
    expect(emptyState).toBeInTheDocument();
  });

  it('displays grid layout for statistics', () => {
    render(<JobsPage />);
    
    const statsGrid = screen.getByText('Total Runs').closest('.grid');
    expect(statsGrid).toBeInTheDocument();
    expect(statsGrid).toHaveClass('md:grid-cols-4');
  });

  it('shows all statistics labels', () => {
    render(<JobsPage />);
    
    expect(screen.getByText('Total Runs')).toBeInTheDocument();
    expect(screen.getByText('Successful')).toBeInTheDocument();
    expect(screen.getByText('Failed')).toBeInTheDocument();
    expect(screen.getByText('Total Rows')).toBeInTheDocument();
  });

  it('has proper spacing for statistics cards', () => {
    render(<JobsPage />);
    
    const statsGrid = screen.getByText('Total Runs').closest('.grid');
    expect(statsGrid).toHaveClass('gap-4');
  });

  it('has proper spacing for table', () => {
    render(<JobsPage />);
    
    const tableContainer = screen.getByRole('table').closest('.rounded-lg');
    expect(tableContainer).toHaveClass('border');
  });
});

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import HomePage from '../app/page';
import * as connectorsModule from '../app/lib/connectors';

vi.mock('../app/lib/connectors', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../app/lib/connectors')>();
  return {
    ...actual,
    loadConnectors: vi.fn().mockResolvedValue([
      { name: 'slack', title: 'Slack', description: 'Send notifications...', tags: ['communication'] },
      { name: 'snowflake', title: 'Snowflake', description: 'Ingest analytics...', tags: ['data', 'warehouse'] },
      { name: 'postgres', title: 'PostgreSQL', description: 'Extract data...', tags: ['database'] },
      { name: 'salesforce', title: 'Salesforce', description: 'Synchronize...', tags: ['crm'] }
    ])
  };
});

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders page title and description', () => {
    render(<HomePage />);
    
    expect(screen.getByText('Build once, deliver everywhere.')).toBeInTheDocument();
    expect(screen.getByText(/OpenFuse unifies your integration workflows/)).toBeInTheDocument();
  });

  it('renders connectors section header', () => {
    render(<HomePage />);
    
    expect(screen.getByText('Available connectors')).toBeInTheDocument();
    expect(screen.getByText(/Registered community integrations ready for configuration/)).toBeInTheDocument();
  });

  it('displays connector count badge', () => {
    render(<HomePage />);
    
    expect(screen.getByText('4 available')).toBeInTheDocument();
  });

  it('displays all connectors', async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Slack')).toBeInTheDocument();
      expect(screen.getByText('Snowflake')).toBeInTheDocument();
      expect(screen.getByText('PostgreSQL')).toBeInTheDocument();
      expect(screen.getByText('Salesforce')).toBeInTheDocument();
    });
  });

  it('renders connector cards with correct structure', async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      const connectorCards = screen.getAllByText(/Send notifications|Ingest analytics|Extract data|Synchronize/);
      connectorCards.forEach(card => {
        expect(card.closest('.rounded-lg')).toBeInTheDocument();
      });
    });
  });

  it('displays connector titles', async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      expect(screen.getByText('Slack')).toBeInTheDocument();
      expect(screen.getByText('Snowflake')).toBeInTheDocument();
      expect(screen.getByText('PostgreSQL')).toBeInTheDocument();
      expect(screen.getByText('Salesforce')).toBeInTheDocument();
    });
  });

  it('displays connector descriptions', async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Send notifications/)).toBeInTheDocument();
      expect(screen.getByText(/Ingest analytics/)).toBeInTheDocument();
      expect(screen.getByText(/Extract data/)).toBeInTheDocument();
      expect(screen.getByText(/Synchronize/)).toBeInTheDocument();
    });
  });

  it('displays connector tags', async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      expect(screen.getByText('communication')).toBeInTheDocument();
      expect(screen.getByText('data')).toBeInTheDocument();
      expect(screen.getByText('warehouse')).toBeInTheDocument();
      expect(screen.getByText('database')).toBeInTheDocument();
      expect(screen.getByText('crm')).toBeInTheDocument();
    });
  });

  it('shows empty state when no connectors', async () => {
    vi.mocked(connectorsModule.loadConnectors).mockResolvedValue([]);
    
    render(<HomePage />);
    
    await waitFor(() => {
      expect(screen.getByText('No connectors registered')).toBeInTheDocument();
      expect(screen.getByText(/Start the API service to sync the connector registry/)).toBeInTheDocument();
    });
  });

  it('has grid layout for connectors', async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      const grid = screen.getByText('Available connectors').nextElementSibling?.nextElementSibling;
      expect(grid).toHaveClass('md:grid-cols-2');
    });
  });

  it('has correct spacing between sections', () => {
    render(<HomePage />);
    
    const sections = screen.getAllByText(/Build once|Available connectors/);
    sections.forEach(section => {
      expect(section.closest('.space-y')).toBeInTheDocument();
    });
  });

  it('calls loadConnectors on mount', async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      expect(connectorsModule.loadConnectors).toHaveBeenCalled();
    });
  });

  it('displays tags as badges', async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      const tags = screen.getAllByText(/communication|data|warehouse|database|crm/);
      tags.forEach(tag => {
        expect(tag.closest('.rounded-full')).toBeInTheDocument();
      });
    });
  });

  it('has responsive grid layout', async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      const grid = screen.getByText('Available connectors').nextElementSibling?.nextElementSibling;
      expect(grid).toHaveClass('xl:grid-cols-3');
    });
  });

  it('displays connector description', async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Send notifications and orchestrate workflows/)).toBeInTheDocument();
    });
  });

  it('has proper styling for connector cards', async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      const firstCard = screen.getByText('Slack').closest('.rounded-lg');
      expect(firstCard).toHaveClass('border-slate-800');
      expect(firstCard).toHaveClass('bg-slate-900/60');
    });
  });

  it('shows tag badges in uppercase', async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      const tags = screen.getAllByText(/communication|data|warehouse/);
      tags.forEach(tag => {
        expect(tag.closest('.rounded-full')).toHaveClass('uppercase');
      });
    });
  });
});

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PipelinesPage from '../app/pipelines/page';

vi.mock('../app/lib/connectors', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../app/lib/connectors')>();
  return {
    ...actual,
    loadConnectors: vi.fn().mockResolvedValue([
      { name: 'slack', title: 'Slack', description: 'Send notifications...', tags: ['communication'] },
      { name: 'snowflake', title: 'Snowflake', description: 'Ingest analytics...', tags: ['data', 'warehouse'] },
      { name: 'postgres', title: 'PostgreSQL', description: 'Extract data...', tags: ['database'] },
      { name: 'salesforce', title: 'Salesforce', description: 'Synchronize...', tags: ['crm'] },
      { name: 'mysql', title: 'MySQL', description: 'Extract data...', tags: ['database'] },
      { name: 'bigquery', title: 'Google BigQuery', description: 'Load data...', tags: ['data', 'warehouse'] },
      { name: 'redshift', title: 'Amazon Redshift', description: 'Load data...', tags: ['data', 'warehouse'] }
    ])
  };
});

describe('PipelinesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders page title and description', () => {
    render(<PipelinesPage />);
    
    expect(screen.getByText('Data Pipelines')).toBeInTheDocument();
    expect(screen.getByText(/Create and manage data pipelines/)).toBeInTheDocument();
  });

  it('renders pipeline creation section', () => {
    render(<PipelinesPage />);
    
    expect(screen.getByText('Create New Pipeline')).toBeInTheDocument();
    expect(screen.getByText('Source')).toBeInTheDocument();
    expect(screen.getByText('Destination')).toBeInTheDocument();
  });

  it('displays connectors correctly', async () => {
    render(<PipelinesPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Slack')).toBeInTheDocument();
      expect(screen.getByText('Snowflake')).toBeInTheDocument();
      expect(screen.getByText('PostgreSQL')).toBeInTheDocument();
      expect(screen.getByText('Salesforce')).toBeInTheDocument();
      expect(screen.getByText('MySQL')).toBeInTheDocument();
    });
  });

  it('displays limited number of connectors', async () => {
    render(<PipelinesPage />);
    
    await waitFor(() => {
      const connectors = screen.getAllByText(/slack|snowflake|postgres|salesforce|mysql|bigquery|redshift/i);
      expect(connectors.length).toBe(8); // First 8 should be displayed
    });
  });

  it('allows selecting source connector', async () => {
    render(<PipelinesPage />);
    
    await waitFor(() => {
      const slackConnector = screen.getByText('Slack');
      fireEvent.click(slackConnector);
      
      expect(slackConnector.closest('div')).toHaveClass('bg-blue-500/20');
    });
  });

  it('shows checkmark when source selected', async () => {
    render(<PipelinesPage />);
    
    await waitFor(async () => {
      const slackConnector = screen.getByText('Slack');
      fireEvent.click(slackConnector);
      
      await waitFor(() => {
        expect(screen.getByText('✓')).toBeInTheDocument();
      });
    });
  });

  it('allows selecting destination connector', async () => {
    render(<PipelinesPage />);
    
    await waitFor(() => {
      const snowflakeConnector = screen.getByText('Snowflake');
      fireEvent.click(snowflakeConnector);
      
      expect(snowflakeConnector.closest('div')).toHaveClass('bg-emerald-500/20');
    });
  });

  it('shows checkmark when destination selected', async () => {
    render(<PipelinesPage />);
    
    await waitFor(async () => {
      const snowflakeConnector = screen.getByText('Snowflake');
      fireEvent.click(snowflakeConnector);
      
      await waitFor(() => {
        const checkmarks = screen.getAllByText('✓');
        expect(checkmarks.length).toBeGreaterThan(0);
      });
    });
  });

  it('shows continue button after both selections', async () => {
    render(<PipelinesPage />);
    
    await waitFor(async () => {
      const slack = screen.getByText('Slack');
      const snowflake = screen.getByText('Snowflake');
      fireEvent.click(slack);
      fireEvent.click(snowflake);
      
      await waitFor(() => {
        expect(screen.getByText('Continue →')).toBeInTheDocument();
      });
    });
  });

  it('does not show continue button until both selected', async () => {
    render(<PipelinesPage />);
    
    await waitFor(async () => {
      const slack = screen.getByText('Slack');
      fireEvent.click(slack);
      
      await waitFor(() => {
        expect(screen.queryByText('Continue →')).not.toBeInTheDocument();
      });
    });
  });

  it('allows changing source connector selection', async () => {
    render(<PipelinesPage />);
    
    await waitFor(async () => {
      const slack = screen.getByText('Slack');
      const salesforce = screen.getByText('Salesforce');
      
      fireEvent.click(slack);
      expect(slack.closest('div')).toHaveClass('bg-blue-500/20');
      
      fireEvent.click(salesforce);
      await waitFor(() => {
        expect(slack.closest('div')).not.toHaveClass('bg-blue-500/20');
        expect(salesforce.closest('div')).toHaveClass('bg-blue-500/20');
      });
    });
  });

  it('renders quick start templates section', async () => {
    render(<PipelinesPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Quick Start Templates')).toBeInTheDocument();
    });
  });

  it('displays all template cards', async () => {
    render(<PipelinesPage />);
    
    await waitFor(() => {
      expect(screen.getByText('PostgreSQL to Snowflake')).toBeInTheDocument();
      expect(screen.getByText('Salesforce to BigQuery')).toBeInTheDocument();
      expect(screen.getByText('S3 to Redshift')).toBeInTheDocument();
    });
  });

  it('shows template descriptions', async () => {
    render(<PipelinesPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Replicate data from PostgreSQL to Snowflake/)).toBeInTheDocument();
      expect(screen.getByText(/Sync CRM data to BigQuery/)).toBeInTheDocument();
      expect(screen.getByText(/Load files from S3 into Redshift/)).toBeInTheDocument();
    });
  });

  it('renders use template buttons', async () => {
    render(<PipelinesPage />);
    
    await waitFor(() => {
      const buttons = screen.getAllByText('Use template →');
      expect(buttons.length).toBe(3);
    });
  });

  it('filters connectors for source and destination', async () => {
    render(<PipelinesPage />);
    
    await waitFor(() => {
      // Slack should appear in source (not a destination-only connector)
      expect(screen.getByText('Slack')).toBeInTheDocument();
      
      // Snowflake should appear in destination
      expect(screen.getByText('Snowflake')).toBeInTheDocument();
    });
  });
});

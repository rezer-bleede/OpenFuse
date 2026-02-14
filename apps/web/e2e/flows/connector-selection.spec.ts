import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PipelinesPage from '../../app/pipelines/page';
import { mockConnectors } from '../fixtures/mocks';
import * as connectorsModule from '../../app/lib/connectors';

vi.mock('../../app/lib/connectors', () => ({
  loadConnectors: vi.fn().mockResolvedValue(mockConnectors),
  getApiUrl: vi.fn().mockReturnValue('http://localhost:8000')
}));

describe('E2E: Pipeline Creation Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders pipeline creation section with source and destination selectors', async () => {
    render(<PipelinesPage />);

    await waitFor(() => {
      expect(screen.getByText('Create New Pipeline')).toBeInTheDocument();
      expect(screen.getByText('Source')).toBeInTheDocument();
      expect(screen.getByText('Destination')).toBeInTheDocument();
    });
  });

  it('displays available connectors', async () => {
    render(<PipelinesPage />);

    await waitFor(() => {
      expect(screen.getByText('Slack')).toBeInTheDocument();
      expect(screen.getByText('Snowflake')).toBeInTheDocument();
      expect(screen.getByText('PostgreSQL')).toBeInTheDocument();
      expect(screen.getByText('Salesforce')).toBeInTheDocument();
    });
  });

  it('allows selecting a source connector', async () => {
    render(<PipelinesPage />);

    await waitFor(() => {
      const slackConnector = screen.getByText('Slack');
      fireEvent.click(slackConnector);

      expect(slackConnector.closest('div')).toHaveClass('bg-blue-500/20');
    });
  });

  it('allows selecting a destination connector', async () => {
    render(<PipelinesPage />);

    await waitFor(() => {
      const snowflakeConnector = screen.getByText('Snowflake');
      fireEvent.click(snowflakeConnector);

      expect(snowflakeConnector.closest('div')).toHaveClass('bg-emerald-500/20');
    });
  });

  it('shows checkmark when source connector is selected', async () => {
    render(<PipelinesPage />);

    await waitFor(() => {
      const slackConnector = screen.getByText('Slack');
      fireEvent.click(slackConnector);

      expect(screen.getByText('✓')).toBeInTheDocument();
    });
  });

  it('shows continue button after both connectors are selected', async () => {
    render(<PipelinesPage />);

    await waitFor(async () => {
      const slackConnector = screen.getByText('Slack');
      const snowflakeConnector = screen.getByText('Snowflake');

      fireEvent.click(slackConnector);
      fireEvent.click(snowflakeConnector);

      await waitFor(() => {
        expect(screen.getByText('Continue →')).toBeInTheDocument();
      });
    });
  });

  it('does not show continue button until both connectors are selected', async () => {
    render(<PipelinesPage />);

    await waitFor(() => {
      const slackConnector = screen.getByText('Slack');
      fireEvent.click(slackConnector);

      expect(screen.queryByText('Continue →')).not.toBeInTheDocument();
    });
  });

  it('allows changing source connector selection', async () => {
    render(<PipelinesPage />);

    await waitFor(async () => {
      const slackConnector = screen.getByText('Slack');
      const salesforceConnector = screen.getByText('Salesforce');

      fireEvent.click(slackConnector);
      expect(slackConnector.closest('div')).toHaveClass('bg-blue-500/20');

      fireEvent.click(salesforceConnector);
      await waitFor(() => {
        expect(slackConnector.closest('div')).not.toHaveClass('bg-blue-500/20');
        expect(salesforceConnector.closest('div')).toHaveClass('bg-blue-500/20');
      });
    });
  });

  it('filters connectors correctly for source and destination', async () => {
    render(<PipelinesPage />);

    await waitFor(() => {
      expect(screen.getByText('Slack')).toBeInTheDocument();
      expect(screen.getByText('Salesforce')).toBeInTheDocument();
      expect(screen.getByText('PostgreSQL')).toBeInTheDocument();
    });
  });

  it('renders quick start templates section', async () => {
    render(<PipelinesPage />);

    await waitFor(() => {
      expect(screen.getByText('Quick Start Templates')).toBeInTheDocument();
      expect(screen.getByText('PostgreSQL to Snowflake')).toBeInTheDocument();
      expect(screen.getByText('Salesforce to BigQuery')).toBeInTheDocument();
      expect(screen.getByText('S3 to Redshift')).toBeInTheDocument();
    });
  });

  it('displays use template buttons', async () => {
    render(<PipelinesPage />);

    await waitFor(() => {
      const templateButtons = screen.getAllByText('Use template →');
      expect(templateButtons.length).toBe(3);
    });
  });
});

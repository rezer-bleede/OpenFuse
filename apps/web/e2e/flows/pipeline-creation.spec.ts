import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';
import NewPipelinePage from '../../app/pipelines/new/page';
import { mockConnectors, mockPipeline } from '../fixtures/mocks';
import * as connectorsModule from '../../app/lib/connectors';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn()
}));

vi.mock('../../app/lib/connectors', () => ({
  loadConnectors: vi.fn().mockResolvedValue(mockConnectors),
  getApiUrl: vi.fn().mockReturnValue('http://localhost:8000')
}));

describe('E2E: Pipeline Creation', () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useRouter).mockReturnValue({ push: mockPush } as any);
    vi.mocked(useSearchParams).mockReturnValue({
      get: vi.fn((key: string) => {
        if (key === 'source') return 'slack';
        if (key === 'dest') return 'snowflake';
        return null;
      })
    } as any);
  });

  it('renders pipeline configuration form', async () => {
    render(<NewPipelinePage />);

    await waitFor(() => {
      expect(screen.getByLabelText(/pipeline name/i)).toBeInTheDocument();
      expect(screen.getByText('Source Configuration')).toBeInTheDocument();
      expect(screen.getByText('Destination Configuration')).toBeInTheDocument();
      expect(screen.getByText('Create Pipeline')).toBeInTheDocument();
    });
  });

  it('displays source and destination connectors', async () => {
    render(<NewPipelinePage />);

    await waitFor(() => {
      expect(screen.getByText('Source')).toBeInTheDocument();
      expect(screen.getByText('Slack')).toBeInTheDocument();
      expect(screen.getByText('Destination')).toBeInTheDocument();
      expect(screen.getByText('Snowflake')).toBeInTheDocument();
    });
  });

  it('pre-fills pipeline name from selected connectors', async () => {
    render(<NewPipelinePage />);

    await waitFor(() => {
      const nameInput = screen.getByLabelText(/pipeline name/i) as HTMLInputElement;
      expect(nameInput.value).toBe('Slack to Snowflake');
    });
  });

  it('allows editing pipeline name', async () => {
    render(<NewPipelinePage />);

    await waitFor(async () => {
      const nameInput = screen.getByLabelText(/pipeline name/i);
      fireEvent.change(nameInput, { target: { value: 'Custom Pipeline Name' } });

      await waitFor(() => {
        const input = nameInput as HTMLInputElement;
        expect(input.value).toBe('Custom Pipeline Name');
      });
    });
  });

  it('shows configuration placeholders for source and destination', async () => {
    render(<NewPipelinePage />);

    await waitFor(() => {
      expect(screen.getByText(/Configuration for Slack will be added here/)).toBeInTheDocument();
      expect(screen.getByText(/Configuration for Snowflake will be added here/)).toBeInTheDocument();
    });
  });

  it('shows back button', async () => {
    render(<NewPipelinePage />);

    await waitFor(() => {
      expect(screen.getByText('← Back')).toBeInTheDocument();
    });
  });

  it('back button navigates to previous page', async () => {
    const mockBack = vi.fn();
    Object.defineProperty(window, 'history', {
      value: { back: mockBack },
      writable: true
    });

    render(<NewPipelinePage />);

    await waitFor(() => {
      const backButton = screen.getByText('← Back');
      fireEvent.click(backButton);
      expect(mockBack).toHaveBeenCalled();
    });
  });

  it('disables create button when pipeline name is empty', async () => {
    render(<NewPipelinePage />);

    await waitFor(async () => {
      const nameInput = screen.getByLabelText(/pipeline name/i);
      fireEvent.change(nameInput, { target: { value: '' } });

      await waitFor(() => {
        const createButton = screen.getByText('Create Pipeline');
        expect(createButton).toBeDisabled();
      });
    });
  });

  it('enables create button when pipeline name is filled', async () => {
    render(<NewPipelinePage />);

    await waitFor(() => {
      const createButton = screen.getByText('Create Pipeline');
      expect(createButton).not.toBeDisabled();
    });
  });

  it('shows invalid configuration error when source or destination not found', async () => {
    vi.mocked(useSearchParams).mockReturnValue({
      get: vi.fn((key: string) => {
        if (key === 'source') return 'invalid_source';
        if (key === 'dest') return 'snowflake';
        return null;
      })
    } as any);

    render(<NewPipelinePage />);

    await waitFor(() => {
      expect(screen.getByText('Invalid Configuration')).toBeInTheDocument();
      expect(screen.getByText(/Please select valid source and destination connectors/)).toBeInTheDocument();
    });
  });

  it('displays correct connector icons', async () => {
    render(<NewPipelinePage />);

    await waitFor(() => {
      const sourceLetter = screen.getByText('S');
      const destLetter = screen.getAllByText('S');
      expect(destLetter.length).toBeGreaterThan(0);
    });
  });

  it('shows connector titles and names', async () => {
    render(<NewPipelinePage />);

    await waitFor(() => {
      expect(screen.getByText('Slack')).toBeInTheDocument();
      expect(screen.getByText('slack')).toBeInTheDocument();
      expect(screen.getByText('Snowflake')).toBeInTheDocument();
      expect(screen.getByText('snowflake')).toBeInTheDocument();
    });
  });
});

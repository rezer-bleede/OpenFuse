import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import PipelinesPage from "../app/(dashboard)/pipelines/page";

const { mockRunPipeline, mockUpdatePipeline, mockDeletePipeline } = vi.hoisted(() => ({
  mockRunPipeline: vi.fn(),
  mockUpdatePipeline: vi.fn(),
  mockDeletePipeline: vi.fn(),
}));

vi.mock("../app/lib/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../app/lib/api")>();
  return {
    ...actual,
    listPipelines: vi.fn().mockResolvedValue({
      pipelines: [
        {
          id: 11,
          name: "Slack to Snowflake",
          source_connector: "slack",
          destination_connector: "snowflake",
          source_config: {},
          destination_config: {},
          schedule_cron: null,
          status: "active",
          replication_mode: "full_table",
          incremental_key: null,
          batch_size: 10000,
          created_at: "2026-02-01T00:00:00Z",
          updated_at: "2026-02-10T00:00:00Z",
        },
      ],
      total: 1,
    }),
    runPipeline: mockRunPipeline.mockResolvedValue({ id: 99 }),
    updatePipeline: mockUpdatePipeline.mockResolvedValue({}),
    deletePipeline: mockDeletePipeline.mockResolvedValue(undefined),
  };
});

vi.mock("../app/lib/connectors", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../app/lib/connectors")>();
  return {
    ...actual,
    listConnectors: vi.fn().mockResolvedValue([
      {
        name: "slack",
        title: "Slack",
        description: "Slack source",
        tags: ["source"],
        capabilities: ["source"],
        config_schema: { type: "object", properties: {}, required: [] },
      },
      {
        name: "snowflake",
        title: "Snowflake",
        description: "Snowflake destination",
        tags: ["destination"],
        capabilities: ["destination"],
        config_schema: { type: "object", properties: {}, required: [] },
      },
    ]),
  };
});

describe("PipelinesPage", () => {
  it("renders pipelines and action buttons", async () => {
    render(<PipelinesPage />);

    await waitFor(() => {
      expect(screen.getByText("Slack to Snowflake")).toBeInTheDocument();
      expect(screen.getByText("Run")).toBeInTheDocument();
      expect(screen.getByText("Pause")).toBeInTheDocument();
    });
  });

  it("runs pipeline from list action", async () => {
    render(<PipelinesPage />);

    await waitFor(() => {
      expect(screen.getByText("Run")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Run"));

    await waitFor(() => {
      expect(mockRunPipeline).toHaveBeenCalledWith(11);
    });
  });
});

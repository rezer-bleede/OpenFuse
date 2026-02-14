import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { PipelineBuilder } from "../../components/pipelines/PipelineBuilder";

const { mockPush, mockCreatePipeline, mockValidateConnectorConfig } = vi.hoisted(() => ({
  mockPush: vi.fn(),
  mockCreatePipeline: vi.fn().mockResolvedValue({ id: 7 }),
  mockValidateConnectorConfig: vi.fn().mockResolvedValue({ name: "x", valid: true }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("../../app/lib/connectors", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../app/lib/connectors")>();
  return {
    ...actual,
    listConnectors: vi.fn().mockResolvedValue([
      {
        name: "slack",
        title: "Slack",
        description: "Slack source",
        tags: ["source"],
        capabilities: ["source"],
        config_schema: {
          type: "object",
          properties: {
            token: { type: "string", title: "Token", format: "password" },
          },
          required: ["token"],
        },
      },
      {
        name: "snowflake",
        title: "Snowflake",
        description: "Snowflake destination",
        tags: ["destination"],
        capabilities: ["destination"],
        config_schema: {
          type: "object",
          properties: {
            account: { type: "string", title: "Account" },
          },
          required: ["account"],
        },
      },
    ]),
  };
});

vi.mock("../../app/lib/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../app/lib/api")>();
  return {
    ...actual,
    createPipeline: mockCreatePipeline,
    validateConnectorConfig: mockValidateConnectorConfig,
    getPipeline: vi.fn(),
    updatePipeline: vi.fn(),
  };
});

describe("E2E: Pipeline Builder", () => {
  it("creates a pipeline through wizard steps", async () => {
    render(<PipelineBuilder mode="create" />);

    await waitFor(() => {
      expect(screen.getByText("Slack")).toBeInTheDocument();
      expect(screen.getByText("Snowflake")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Slack"));
    fireEvent.click(screen.getByText("Snowflake"));
    fireEvent.click(screen.getByText("Continue"));

    await waitFor(() => {
      expect(screen.getByLabelText(/Token/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Account/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/Token/i), { target: { value: "xoxb-token" } });
    fireEvent.change(screen.getByLabelText(/Account/i), { target: { value: "acct" } });
    fireEvent.click(screen.getByText("Continue"));

    await waitFor(() => {
      expect(mockValidateConnectorConfig).toHaveBeenCalledTimes(2);
    });

    fireEvent.click(screen.getByRole("button", { name: "Create Pipeline" }));

    await waitFor(() => {
      expect(mockCreatePipeline).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/pipelines/7");
    });
  });
});

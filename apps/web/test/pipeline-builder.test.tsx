import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { PipelineBuilder } from "../components/pipelines/PipelineBuilder";

const { mockPush, mockValidateConnectorConfig, mockCreatePipeline } = vi.hoisted(() => ({
  mockPush: vi.fn(),
  mockValidateConnectorConfig: vi.fn().mockResolvedValue({ valid: true }),
  mockCreatePipeline: vi.fn().mockResolvedValue({ id: 42 }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

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
        config_schema: {
          type: "object",
          properties: { token: { type: "string", title: "Token", format: "password" } },
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
          properties: { account: { type: "string", title: "Account" } },
          required: ["account"],
        },
      },
    ]),
  };
});

vi.mock("../app/lib/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../app/lib/api")>();
  return {
    ...actual,
    validateConnectorConfig: mockValidateConnectorConfig,
    createPipeline: mockCreatePipeline,
    getPipeline: vi.fn(),
    updatePipeline: vi.fn(),
  };
});

describe("PipelineBuilder", () => {
  it("walks create flow and submits pipeline", async () => {
    render(<PipelineBuilder mode="create" />);

    await waitFor(() => {
      expect(screen.getByText("Slack")).toBeInTheDocument();
      expect(screen.getByText("Snowflake")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Slack"));
    fireEvent.click(screen.getByText("Snowflake"));
    fireEvent.click(screen.getByText("Continue"));

    await waitFor(() => {
      expect(screen.getByText("Validate Connector Config")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/Token/i), { target: { value: "xoxb" } });
    fireEvent.change(screen.getByLabelText(/Account/i), { target: { value: "acct" } });

    fireEvent.click(screen.getByText("Continue"));

    await waitFor(() => {
      expect(mockValidateConnectorConfig).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Create Pipeline" })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole("button", { name: "Create Pipeline" }));

    await waitFor(() => {
      expect(mockCreatePipeline).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/pipelines/42");
    });
  });
});

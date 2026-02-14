import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ConnectorsPage from "../app/(dashboard)/page";
import * as connectorsModule from "../app/lib/connectors";

vi.mock("../app/lib/connectors", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../app/lib/connectors")>();
  return {
    ...actual,
    listConnectors: vi.fn().mockResolvedValue([
      {
        name: "slack",
        title: "Slack",
        description: "Slack source",
        tags: ["communication", "source"],
        capabilities: ["source"],
        config_schema: { type: "object", properties: {}, required: [] },
      },
      {
        name: "snowflake",
        title: "Snowflake",
        description: "Snowflake destination",
        tags: ["warehouse", "destination"],
        capabilities: ["destination"],
        config_schema: { type: "object", properties: {}, required: [] },
      },
    ]),
  };
});

describe("ConnectorsPage", () => {
  it("renders connector catalogue and filters", async () => {
    render(<ConnectorsPage />);

    await waitFor(() => {
      expect(screen.getByText("Slack")).toBeInTheDocument();
      expect(screen.getByText("Snowflake")).toBeInTheDocument();
    });

    const capabilityFilter = screen.getByLabelText("Capability");
    fireEvent.change(capabilityFilter, { target: { value: "destination" } });

    await waitFor(() => {
      expect(screen.queryByText("Slack")).not.toBeInTheDocument();
      expect(screen.getByText("Snowflake")).toBeInTheDocument();
    });
  });

  it("supports search filtering", async () => {
    render(<ConnectorsPage />);

    await waitFor(() => {
      expect(screen.getByText("Slack")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("Search"), { target: { value: "snow" } });

    await waitFor(() => {
      expect(screen.queryByText("Slack")).not.toBeInTheDocument();
      expect(screen.getByText("Snowflake")).toBeInTheDocument();
    });
  });
});

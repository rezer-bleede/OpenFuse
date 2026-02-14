import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import ConnectorsPage from "../../app/(dashboard)/page";

vi.mock("../../app/lib/connectors", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../app/lib/connectors")>();
  return {
    ...actual,
    listConnectors: vi.fn().mockResolvedValue([
      {
        name: "postgres",
        title: "PostgreSQL",
        description: "Database source",
        tags: ["database", "source"],
        capabilities: ["source"],
        config_schema: { type: "object", properties: {}, required: [] },
      },
      {
        name: "bigquery",
        title: "Google BigQuery",
        description: "Warehouse destination",
        tags: ["warehouse", "destination"],
        capabilities: ["destination"],
        config_schema: { type: "object", properties: {}, required: [] },
      },
    ]),
  };
});

describe("E2E: Connector Discovery", () => {
  it("filters connectors by capability and search text", async () => {
    render(<ConnectorsPage />);

    await waitFor(() => {
      expect(screen.getByText("PostgreSQL")).toBeInTheDocument();
      expect(screen.getByText("Google BigQuery")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("Capability"), { target: { value: "destination" } });
    await waitFor(() => {
      expect(screen.queryByText("PostgreSQL")).not.toBeInTheDocument();
      expect(screen.getByText("Google BigQuery")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("Search"), { target: { value: "postgres" } });
    await waitFor(() => {
      expect(screen.queryByText("Google BigQuery")).not.toBeInTheDocument();
    });
  });
});

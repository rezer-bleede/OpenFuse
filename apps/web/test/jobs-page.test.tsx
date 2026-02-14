import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import JobsPage from "../app/(dashboard)/jobs/page";

const { mockListJobs } = vi.hoisted(() => ({
  mockListJobs: vi.fn().mockResolvedValue({
    jobs: [
      {
        id: 1,
        pipeline_id: 10,
        status: "completed",
        rows_synced: 300,
        created_at: "2026-02-10T00:00:00Z",
        started_at: "2026-02-10T00:00:00Z",
        completed_at: "2026-02-10T00:10:00Z",
        error_message: null,
      },
      {
        id: 2,
        pipeline_id: 11,
        status: "failed",
        rows_synced: 0,
        created_at: "2026-02-11T00:00:00Z",
        started_at: "2026-02-11T00:00:00Z",
        completed_at: "2026-02-11T00:05:00Z",
        error_message: "boom",
      },
    ],
    total: 2,
  }),
}));

vi.mock("../app/lib/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../app/lib/api")>();
  return {
    ...actual,
    listJobs: mockListJobs,
  };
});

describe("JobsPage", () => {
  it("renders job stats and rows", async () => {
    render(<JobsPage />);

    await waitFor(() => {
      expect(screen.getByText("Total Runs")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getAllByText("Rows Synced").length).toBeGreaterThan(0);
      expect(screen.getAllByText("300").length).toBeGreaterThan(0);
      expect(screen.getByText("#1")).toBeInTheDocument();
      expect(screen.getByText("#2")).toBeInTheDocument();
    });
  });

  it("queries API again when status filter changes", async () => {
    render(<JobsPage />);
    await waitFor(() => expect(mockListJobs).toHaveBeenCalled());

    fireEvent.change(screen.getByLabelText("Status"), { target: { value: "failed" } });

    await waitFor(() => {
      expect(mockListJobs).toHaveBeenCalledWith({ status: "failed" });
    });
  });
});

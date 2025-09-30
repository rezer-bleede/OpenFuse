import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import HomePage from "../app/page";
import { defaultConnectors, loadConnectors } from "../app/lib/connectors";

vi.mock("../app/lib/connectors", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../app/lib/connectors")>();
  return {
    ...actual,
    loadConnectors: vi.fn(actual.loadConnectors),
  };
});

describe("HomePage", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders connector cards using the loader", async () => {
    vi.mocked(loadConnectors).mockResolvedValue(defaultConnectors);

    const page = await HomePage();
    render(page);

    for (const connector of defaultConnectors) {
      expect(screen.getByText(connector.title)).toBeInTheDocument();
      expect(screen.getByText(connector.description)).toBeInTheDocument();
    }

    expect(screen.getByText(`${defaultConnectors.length} available`)).toBeInTheDocument();
  });
});

import { afterEach, describe, expect, it, vi } from "vitest";

import {
  defaultConnectors,
  getApiUrl,
  loadConnectors,
  type Connector,
  type FetchLike,
} from "../app/lib/connectors";

describe("loadConnectors", () => {
  const originalEnv = process.env.NEXT_PUBLIC_API_URL;

  afterEach(() => {
    process.env.NEXT_PUBLIC_API_URL = originalEnv;
    vi.restoreAllMocks();
  });

  it("returns bundled connectors when no API URL is configured", async () => {
    delete process.env.NEXT_PUBLIC_API_URL;
    const fetchSpy = vi.fn();

    const connectors = await loadConnectors(fetchSpy as unknown as FetchLike);

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(connectors).toEqual(defaultConnectors);
  });

  it("returns remote connectors when the request succeeds", async () => {
    process.env.NEXT_PUBLIC_API_URL = "https://registry.openfuse.dev";
    const remoteConnectors: Connector[] = [
      {
        name: "github",
        title: "GitHub",
        description: "Sync repositories and webhook deliveries.",
        tags: ["developer", "source-control"],
      },
    ];

    const fetchSpy = vi.fn(async () => ({
      ok: true,
      status: 200,
      statusText: "OK",
      json: async () => ({ connectors: remoteConnectors }),
    })) as unknown as FetchLike;

    const connectors = await loadConnectors(fetchSpy);

    expect(fetchSpy).toHaveBeenCalledWith("https://registry.openfuse.dev/api/v1/connectors", { cache: "no-store" });
    expect(connectors).toEqual(remoteConnectors);
  });

  it("falls back to bundled connectors when the response is not ok", async () => {
    process.env.NEXT_PUBLIC_API_URL = "https://registry.openfuse.dev";

    const fetchSpy = vi.fn(async () => ({
      ok: false,
      status: 503,
      statusText: "Service Unavailable",
      json: async () => ({ message: "maintenance" }),
    })) as unknown as FetchLike;

    const connectors = await loadConnectors(fetchSpy);

    expect(connectors).toEqual(defaultConnectors);
  });

  it("falls back to bundled connectors when the request throws", async () => {
    process.env.NEXT_PUBLIC_API_URL = "https://registry.openfuse.dev";

    const fetchSpy = vi.fn(async () => {
      throw new Error("network down");
    }) as unknown as FetchLike;

    const connectors = await loadConnectors(fetchSpy);

    expect(connectors).toEqual(defaultConnectors);
  });
});

describe("getApiUrl", () => {
  const originalEnv = process.env.NEXT_PUBLIC_API_URL;

  afterEach(() => {
    process.env.NEXT_PUBLIC_API_URL = originalEnv;
  });

  it("returns null when the environment variable is empty", () => {
    process.env.NEXT_PUBLIC_API_URL = "";
    expect(getApiUrl()).toBeNull();
  });

  it("returns null when the environment variable is invalid", () => {
    process.env.NEXT_PUBLIC_API_URL = "not a url";
    expect(getApiUrl()).toBeNull();
  });

  it("normalises the URL and strips paths", () => {
    process.env.NEXT_PUBLIC_API_URL = "https://api.example.com/v1";
    expect(getApiUrl()).toBe("https://api.example.com");
  });
});

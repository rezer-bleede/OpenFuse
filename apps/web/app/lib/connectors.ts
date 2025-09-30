export type Connector = {
  name: string;
  title: string;
  description: string;
  tags: string[];
};

export const defaultConnectors: Connector[] = [
  {
    name: "slack",
    title: "Slack",
    description: "Send notifications and orchestrate workflows using Slack channels and threads.",
    tags: ["communication", "notifications"],
  },
  {
    name: "salesforce",
    title: "Salesforce",
    description: "Synchronize accounts, opportunities, and leads with bidirectional syncing.",
    tags: ["crm", "enterprise"],
  },
  {
    name: "snowflake",
    title: "Snowflake",
    description: "Ingest analytics-ready datasets into Snowflake with automatic schema evolution.",
    tags: ["data", "warehouse"],
  },
];

const isNonEmptyString = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;

const isConnector = (value: unknown): value is Connector => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Partial<Connector>;

  return (
    isNonEmptyString(candidate.name) &&
    isNonEmptyString(candidate.title) &&
    isNonEmptyString(candidate.description) &&
    Array.isArray(candidate.tags) &&
    candidate.tags.every(isNonEmptyString)
  );
};

const sanitizeConnectors = (maybeConnectors: unknown): Connector[] => {
  if (!Array.isArray(maybeConnectors)) {
    return defaultConnectors;
  }

  const parsed = maybeConnectors.filter(isConnector);
  return parsed.length > 0 ? parsed : defaultConnectors;
};

const normaliseUrl = (rawUrl: string | undefined): string | null => {
  if (!rawUrl) {
    return null;
  }

  const trimmed = rawUrl.trim();
  if (trimmed.length === 0) {
    return null;
  }

  try {
    const url = new URL(trimmed);
    return url.origin;
  } catch (error) {
    console.warn(`Ignoring invalid NEXT_PUBLIC_API_URL value: ${trimmed}`);
    return null;
  }
};

export const getApiUrl = (): string | null => {
  return normaliseUrl(process.env.NEXT_PUBLIC_API_URL);
};

export type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export async function loadConnectors(fetchImpl: FetchLike = fetch): Promise<Connector[]> {
  const apiUrl = getApiUrl();
  if (!apiUrl) {
    return defaultConnectors;
  }

  try {
    const response = await fetchImpl(`${apiUrl}/api/v1/connectors`, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.warn(`Failed to load connector metadata from ${apiUrl}: ${response.status} ${response.statusText}`);
      return defaultConnectors;
    }

    const payload = (await response.json()) as { connectors?: unknown };
    return sanitizeConnectors(payload.connectors);
  } catch (error) {
    console.warn(`Unable to reach API at ${apiUrl}. Falling back to bundled connector metadata.`, error);
    return defaultConnectors;
  }
}

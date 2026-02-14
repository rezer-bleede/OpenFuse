import { fallbackConnectorCatalog } from "./connectors.catalog";

export type ConnectorCapability = "source" | "destination";

export type ConnectorSchemaProperty = {
  type?: "string" | "integer" | "boolean" | "array" | "number";
  title?: string;
  description?: string;
  enum?: string[];
  format?: string;
  default?: unknown;
  items?: {
    type?: string;
  };
};

export type ConnectorSchema = {
  type: "object";
  properties: Readonly<Record<string, ConnectorSchemaProperty>>;
  required?: readonly string[];
  additionalProperties?: boolean;
};

export type Connector = {
  name: string;
  title: string;
  description: string;
  tags: string[];
  capabilities: ConnectorCapability[];
  config_schema: ConnectorSchema;
};

export const defaultConnectors: Connector[] = fallbackConnectorCatalog.map((connector) => ({
  name: connector.name,
  title: connector.title,
  description: connector.description,
  tags: [...connector.tags],
  capabilities: [...connector.capabilities] as ConnectorCapability[],
  config_schema: connector.config_schema as ConnectorSchema,
}));

const isNonEmptyString = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;

const deriveCapabilities = (tags: string[]): ConnectorCapability[] => {
  const lowered = tags.map((tag) => tag.toLowerCase());
  const capabilities: ConnectorCapability[] = [];
  if (lowered.includes("source")) {
    capabilities.push("source");
  }
  if (lowered.includes("destination")) {
    capabilities.push("destination");
  }
  return capabilities;
};

const sanitizeSchema = (value: unknown): ConnectorSchema => {
  if (typeof value !== "object" || value === null) {
    return {
      type: "object",
      properties: {},
    };
  }

  const candidate = value as Partial<ConnectorSchema>;
  if (candidate.type !== "object" || typeof candidate.properties !== "object" || candidate.properties === null) {
    return {
      type: "object",
      properties: {},
    };
  }

  return {
    type: "object",
    properties: candidate.properties as Record<string, ConnectorSchemaProperty>,
    required: Array.isArray(candidate.required) ? candidate.required.filter(isNonEmptyString) : [],
    additionalProperties: typeof candidate.additionalProperties === "boolean" ? candidate.additionalProperties : undefined,
  };
};

const sanitizeConnector = (value: unknown): Connector | null => {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  const candidate = value as Partial<Connector>;
  if (!isNonEmptyString(candidate.name) || !isNonEmptyString(candidate.title) || !isNonEmptyString(candidate.description)) {
    return null;
  }

  const tags = Array.isArray(candidate.tags) ? candidate.tags.filter(isNonEmptyString) : [];

  let capabilities: ConnectorCapability[] = [];
  if (Array.isArray(candidate.capabilities)) {
    capabilities = candidate.capabilities.filter(
      (capability): capability is ConnectorCapability => capability === "source" || capability === "destination",
    );
  }
  if (capabilities.length === 0) {
    capabilities = deriveCapabilities(tags);
  }

  return {
    name: candidate.name,
    title: candidate.title,
    description: candidate.description,
    tags,
    capabilities,
    config_schema: sanitizeSchema(candidate.config_schema),
  };
};

const sanitizeConnectors = (maybeConnectors: unknown): Connector[] => {
  if (!Array.isArray(maybeConnectors)) {
    return defaultConnectors;
  }

  const parsed = maybeConnectors.map(sanitizeConnector).filter((connector): connector is Connector => connector !== null);
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
  } catch {
    return null;
  }
};

export const getApiUrl = (): string | null => normaliseUrl(process.env.NEXT_PUBLIC_API_URL);

const getRuntimeApiUrl = (): string => {
  const configured = getApiUrl();
  if (!configured) {
    return "http://localhost:8000";
  }

  try {
    const parsed = new URL(configured);
    if (parsed.hostname === "api") {
      return "http://localhost:8000";
    }
  } catch {
    return "http://localhost:8000";
  }

  return configured;
};

export type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export async function loadConnectors(
  fetchImpl: FetchLike = fetch,
  capability?: ConnectorCapability,
): Promise<Connector[]> {
  const apiUrl = getApiUrl();
  const fallback = capability
    ? defaultConnectors.filter((connector) => connector.capabilities.includes(capability))
    : defaultConnectors;

  if (!apiUrl) {
    return fallback;
  }

  try {
    const runtimeApiUrl = getRuntimeApiUrl();
    const query = capability ? `?capability=${capability}` : "";
    const response = await fetchImpl(`${runtimeApiUrl}/api/v1/connectors${query}`, {
      cache: "no-store",
    });
    if (!response.ok) {
      return fallback;
    }

    const payload = (await response.json()) as { connectors?: unknown };
    const connectors = sanitizeConnectors(payload.connectors);
    return capability
      ? connectors.filter((connector) => connector.capabilities.includes(capability))
      : connectors;
  } catch {
    return fallback;
  }
}

export const listConnectors = async (capability?: ConnectorCapability): Promise<Connector[]> =>
  loadConnectors(fetch, capability);

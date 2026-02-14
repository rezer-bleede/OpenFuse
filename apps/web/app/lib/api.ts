import { getApiUrl, type Connector, type ConnectorCapability, type ConnectorSchema, loadConnectors } from "./connectors";

export type PipelineStatus = "draft" | "active" | "paused" | "failed" | "deleted";
export type ReplicationMode = "full_table" | "incremental_key" | "log_based";
export type JobStatus = "pending" | "running" | "completed" | "failed" | "cancelled";

export type PipelineSummary = {
  id: number;
  name: string;
  description?: string | null;
  source_connector: string;
  source_config: Record<string, unknown>;
  destination_connector: string;
  destination_config: Record<string, unknown>;
  schedule_cron?: string | null;
  status: PipelineStatus;
  replication_mode: ReplicationMode;
  incremental_key?: string | null;
  batch_size: number;
  created_at: string;
  updated_at: string;
};

export type PipelineDetail = PipelineSummary;

export type JobSummary = {
  id: number;
  pipeline_id: number;
  status: JobStatus;
  rows_synced: number;
  error_message?: string | null;
  started_at?: string | null;
  completed_at?: string | null;
  created_at: string;
};

export type JobDetail = JobSummary;

export type PipelineCreateInput = {
  name: string;
  description?: string;
  source_connector: string;
  source_config: Record<string, unknown>;
  destination_connector: string;
  destination_config: Record<string, unknown>;
  schedule_cron?: string;
  replication_mode?: ReplicationMode;
  incremental_key?: string;
  batch_size?: number;
};

export type PipelineUpdateInput = Partial<{
  name: string;
  description: string;
  source_config: Record<string, unknown>;
  destination_config: Record<string, unknown>;
  schedule_cron: string;
  status: PipelineStatus;
  replication_mode: ReplicationMode;
  incremental_key: string;
  batch_size: number;
}>;

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const runtimeApiUrl = (): string => {
  const configured = getApiUrl();
  if (!configured) {
    return "http://localhost:8000";
  }

  try {
    const parsed = new URL(configured);
    if (parsed.hostname === "api") {
      return "http://localhost:8000";
    }
    return configured;
  } catch {
    return "http://localhost:8000";
  }
};

const apiFetch = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${runtimeApiUrl()}${path}`, {
    cache: "no-store",
    ...init,
  });

  if (!response.ok) {
    let message = response.statusText;
    try {
      const payload = (await response.json()) as { detail?: string };
      if (payload.detail) {
        message = payload.detail;
      }
    } catch {
      message = response.statusText;
    }
    throw new ApiError(response.status, message || "Request failed");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
};

export const listConnectors = async (capability?: ConnectorCapability): Promise<Connector[]> =>
  loadConnectors(fetch, capability);

export const listPipelines = async (statusFilter?: PipelineStatus): Promise<{ pipelines: PipelineSummary[]; total: number }> => {
  const params = new URLSearchParams();
  if (statusFilter) {
    params.set("status_filter", statusFilter);
  }
  const suffix = params.toString().length > 0 ? `?${params.toString()}` : "";
  return apiFetch<{ pipelines: PipelineSummary[]; total: number }>(`/api/v1/pipelines${suffix}`);
};

export const getPipeline = async (pipelineId: number): Promise<PipelineDetail> =>
  apiFetch<PipelineDetail>(`/api/v1/pipelines/${pipelineId}`);

export const createPipeline = async (payload: PipelineCreateInput): Promise<PipelineDetail> =>
  apiFetch<PipelineDetail>("/api/v1/pipelines", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

export const updatePipeline = async (pipelineId: number, payload: PipelineUpdateInput): Promise<PipelineDetail> =>
  apiFetch<PipelineDetail>(`/api/v1/pipelines/${pipelineId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

export const deletePipeline = async (pipelineId: number): Promise<void> =>
  apiFetch<void>(`/api/v1/pipelines/${pipelineId}`, {
    method: "DELETE",
  });

export const runPipeline = async (pipelineId: number): Promise<JobDetail> =>
  apiFetch<JobDetail>(`/api/v1/pipelines/${pipelineId}/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });

export const listPipelineJobs = async (pipelineId: number): Promise<{ jobs: JobSummary[]; total: number }> =>
  apiFetch<{ jobs: JobSummary[]; total: number }>(`/api/v1/pipelines/${pipelineId}/jobs`);

export const listJobs = async (options?: {
  status?: JobStatus;
  pipelineId?: number;
  skip?: number;
  limit?: number;
}): Promise<{ jobs: JobSummary[]; total: number }> => {
  const params = new URLSearchParams();
  if (options?.status) {
    params.set("status_filter", options.status);
  }
  if (typeof options?.pipelineId === "number") {
    params.set("pipeline_id", String(options.pipelineId));
  }
  if (typeof options?.skip === "number") {
    params.set("skip", String(options.skip));
  }
  if (typeof options?.limit === "number") {
    params.set("limit", String(options.limit));
  }
  const suffix = params.toString().length > 0 ? `?${params.toString()}` : "";
  return apiFetch<{ jobs: JobSummary[]; total: number }>(`/api/v1/jobs${suffix}`);
};

export const validateConnectorConfig = async (
  connectorName: string,
  config: Record<string, unknown>,
): Promise<{ name: string; valid: boolean }> =>
  apiFetch<{ name: string; valid: boolean }>(`/api/v1/connectors/${connectorName}/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ config }),
  });

export const isRequiredField = (schema: ConnectorSchema, fieldName: string): boolean =>
  Array.isArray(schema.required) && schema.required.includes(fieldName);

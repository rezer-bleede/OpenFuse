"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  ApiError,
  createPipeline,
  getPipeline,
  type PipelineDetail,
  type ReplicationMode,
  updatePipeline,
  validateConnectorConfig,
} from "@/app/lib/api";
import { listConnectors, type Connector } from "@/app/lib/connectors";
import { SchemaForm } from "@/components/forms/SchemaForm";

type PipelineBuilderProps = {
  mode: "create" | "edit";
  pipelineId?: number;
};

type NoticeState = {
  tone: "success" | "error" | "info";
  message: string;
} | null;

const DEFAULT_BATCH_SIZE = 10000;
const DRAFT_KEY = "openfuse.pipelineDraft.v1";

const maskConfigValues = (connector: Connector | null, config: Record<string, unknown>) => {
  if (!connector) {
    return config;
  }

  const masked: Record<string, unknown> = {};
  const properties = connector.config_schema.properties;
  for (const [key, value] of Object.entries(config)) {
    if (properties[key]?.format === "password") {
      masked[key] = "********";
    } else {
      masked[key] = value;
    }
  }
  return masked;
};

const normaliseApiError = (error: unknown, fallback: string): string => {
  if (error instanceof ApiError) {
    return error.message;
  }
  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }
  return fallback;
};

export function PipelineBuilder({ mode, pipelineId }: PipelineBuilderProps) {
  const router = useRouter();
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [notice, setNotice] = useState<NoticeState>(null);

  const [step, setStep] = useState(mode === "edit" ? 1 : 0);
  const [searchTerm, setSearchTerm] = useState("");
  const [pipeline, setPipeline] = useState<PipelineDetail | null>(null);

  const [sourceConnectorName, setSourceConnectorName] = useState("");
  const [destinationConnectorName, setDestinationConnectorName] = useState("");
  const [sourceConfig, setSourceConfig] = useState<Record<string, unknown>>({});
  const [destinationConfig, setDestinationConfig] = useState<Record<string, unknown>>({});
  const [sourceErrors, setSourceErrors] = useState<Record<string, string>>({});
  const [destinationErrors, setDestinationErrors] = useState<Record<string, string>>({});

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [scheduleCron, setScheduleCron] = useState("");
  const [replicationMode, setReplicationMode] = useState<ReplicationMode>("full_table");
  const [incrementalKey, setIncrementalKey] = useState("");
  const [batchSize, setBatchSize] = useState(DEFAULT_BATCH_SIZE);

  const sourceConnector = useMemo(
    () => connectors.find((connector) => connector.name === sourceConnectorName) ?? null,
    [connectors, sourceConnectorName],
  );
  const destinationConnector = useMemo(
    () => connectors.find((connector) => connector.name === destinationConnectorName) ?? null,
    [connectors, destinationConnectorName],
  );

  const sourceOptions = useMemo(
    () =>
      connectors
        .filter((connector) => connector.capabilities.includes("source"))
        .filter((connector) => {
          if (searchTerm.trim().length === 0) {
            return true;
          }
          const needle = searchTerm.toLowerCase();
          return (
            connector.title.toLowerCase().includes(needle) ||
            connector.name.toLowerCase().includes(needle) ||
            connector.tags.some((tag) => tag.toLowerCase().includes(needle))
          );
        }),
    [connectors, searchTerm],
  );

  const destinationOptions = useMemo(
    () =>
      connectors
        .filter((connector) => connector.capabilities.includes("destination"))
        .filter((connector) => {
          if (searchTerm.trim().length === 0) {
            return true;
          }
          const needle = searchTerm.toLowerCase();
          return (
            connector.title.toLowerCase().includes(needle) ||
            connector.name.toLowerCase().includes(needle) ||
            connector.tags.some((tag) => tag.toLowerCase().includes(needle))
          );
        }),
    [connectors, searchTerm],
  );

  useEffect(() => {
    const bootstrap = async () => {
      setIsLoading(true);
      setNotice(null);
      try {
        const connectorResponse = await listConnectors();
        setConnectors(connectorResponse);

        if (mode === "create") {
          const rawDraft = window.localStorage.getItem(DRAFT_KEY);
          if (rawDraft) {
            const draft = JSON.parse(rawDraft) as {
              sourceConnectorName?: string;
              destinationConnectorName?: string;
              sourceConfig?: Record<string, unknown>;
              destinationConfig?: Record<string, unknown>;
              name?: string;
              description?: string;
              scheduleCron?: string;
              replicationMode?: ReplicationMode;
              incrementalKey?: string;
              batchSize?: number;
            };
            setSourceConnectorName(draft.sourceConnectorName ?? "");
            setDestinationConnectorName(draft.destinationConnectorName ?? "");
            setSourceConfig(draft.sourceConfig ?? {});
            setDestinationConfig(draft.destinationConfig ?? {});
            setName(draft.name ?? "");
            setDescription(draft.description ?? "");
            setScheduleCron(draft.scheduleCron ?? "");
            setReplicationMode(draft.replicationMode ?? "full_table");
            setIncrementalKey(draft.incrementalKey ?? "");
            setBatchSize(typeof draft.batchSize === "number" ? draft.batchSize : DEFAULT_BATCH_SIZE);
          }
          return;
        }

        if (!pipelineId) {
          throw new Error("Missing pipeline id for edit mode.");
        }

        const existing = await getPipeline(pipelineId);
        setPipeline(existing);
        setSourceConnectorName(existing.source_connector);
        setDestinationConnectorName(existing.destination_connector);
        setSourceConfig(existing.source_config ?? {});
        setDestinationConfig(existing.destination_config ?? {});
        setName(existing.name);
        setDescription(existing.description ?? "");
        setScheduleCron(existing.schedule_cron ?? "");
        setReplicationMode(existing.replication_mode);
        setIncrementalKey(existing.incremental_key ?? "");
        setBatchSize(existing.batch_size ?? DEFAULT_BATCH_SIZE);
      } catch (error) {
        setNotice({
          tone: "error",
          message: normaliseApiError(error, "Failed to load pipeline builder context."),
        });
      } finally {
        setIsLoading(false);
      }
    };

    bootstrap();
  }, [mode, pipelineId]);

  useEffect(() => {
    if (mode !== "create") {
      return;
    }

    const draft = {
      sourceConnectorName,
      destinationConnectorName,
      sourceConfig,
      destinationConfig,
      name,
      description,
      scheduleCron,
      replicationMode,
      incrementalKey,
      batchSize,
    };
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }, [
    mode,
    sourceConnectorName,
    destinationConnectorName,
    sourceConfig,
    destinationConfig,
    name,
    description,
    scheduleCron,
    replicationMode,
    incrementalKey,
    batchSize,
  ]);

  useEffect(() => {
    if (name.trim().length > 0) {
      return;
    }
    if (!sourceConnector || !destinationConnector) {
      return;
    }
    setName(`${sourceConnector.title} to ${destinationConnector.title}`);
  }, [sourceConnector, destinationConnector, name]);

  const validateConfigs = async (): Promise<boolean> => {
    if (!sourceConnector || !destinationConnector) {
      setNotice({ tone: "error", message: "Select both source and destination connectors first." });
      return false;
    }

    setIsValidating(true);
    setSourceErrors({});
    setDestinationErrors({});
    try {
      await validateConnectorConfig(sourceConnector.name, sourceConfig);
    } catch (error) {
      setSourceErrors({
        _form: normaliseApiError(error, "Source configuration is invalid."),
      });
      setIsValidating(false);
      return false;
    }

    try {
      await validateConnectorConfig(destinationConnector.name, destinationConfig);
    } catch (error) {
      setDestinationErrors({
        _form: normaliseApiError(error, "Destination configuration is invalid."),
      });
      setIsValidating(false);
      return false;
    }

    setIsValidating(false);
    setNotice({ tone: "success", message: "Connector settings validated." });
    return true;
  };

  const totalSteps = mode === "create" ? 3 : 2;
  const stepLabels = mode === "create" ? ["Connectors", "Configuration", "Review"] : ["Configuration", "Review"];

  const submit = async () => {
    if (!sourceConnector || !destinationConnector) {
      setNotice({ tone: "error", message: "Select both connectors before submitting." });
      return;
    }

    setIsSubmitting(true);
    setNotice(null);
    try {
      if (mode === "create") {
        const created = await createPipeline({
          name: name.trim(),
          description: description.trim() || undefined,
          source_connector: sourceConnector.name,
          destination_connector: destinationConnector.name,
          source_config: sourceConfig,
          destination_config: destinationConfig,
          schedule_cron: scheduleCron.trim() || undefined,
          replication_mode: replicationMode,
          incremental_key: incrementalKey.trim() || undefined,
          batch_size: batchSize,
        });
        window.localStorage.removeItem(DRAFT_KEY);
        router.push(`/pipelines/${created.id}`);
        return;
      }

      if (!pipelineId) {
        throw new Error("Missing pipeline id.");
      }

      const updated = await updatePipeline(pipelineId, {
        name: name.trim(),
        description: description.trim() || undefined,
        source_config: sourceConfig,
        destination_config: destinationConfig,
        schedule_cron: scheduleCron.trim() || undefined,
        replication_mode: replicationMode,
        incremental_key: incrementalKey.trim() || undefined,
        batch_size: batchSize,
      });
      setPipeline(updated);
      router.push(`/pipelines/${updated.id}`);
    } catch (error) {
      setNotice({
        tone: "error",
        message: normaliseApiError(error, "Unable to save pipeline."),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <p className="text-sm text-[var(--muted)]">Loading pipeline workspace...</p>;
  }

  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-[var(--surface-stroke)] bg-[var(--surface-2)] p-5 shadow-panel">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold text-[var(--text-strong)]">
              {mode === "create" ? "Create Pipeline" : `Edit Pipeline #${pipeline?.id ?? pipelineId}`}
            </h3>
            <p className="text-sm text-[var(--muted)]">
              {mode === "create"
                ? "Configure source, destination, and operational settings."
                : "Update connector settings and operational metadata."}
            </p>
          </div>
          <button
            className="rounded-lg border border-[var(--surface-stroke)] px-3 py-2 text-sm text-[var(--text-soft)] hover:bg-[var(--surface-3)]"
            onClick={() => router.push("/pipelines")}
            type="button"
          >
            Back to Pipelines
          </button>
        </div>
        <div className="mt-5 grid gap-2 md:grid-cols-3">
          {stepLabels.map((label, index) => {
            const active = index === step;
            const complete = index < step;
            return (
              <div
                className={`rounded-lg border px-3 py-2 text-sm ${
                  active
                    ? "border-cyan-300/40 bg-cyan-500/10 text-cyan-100"
                    : complete
                      ? "border-emerald-300/30 bg-emerald-500/10 text-emerald-100"
                      : "border-[var(--surface-stroke)] bg-[var(--surface-3)] text-[var(--text-soft)]"
                }`}
                key={label}
              >
                {index + 1}. {label}
              </div>
            );
          })}
        </div>
      </header>

      {notice ? (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            notice.tone === "success"
              ? "border-emerald-300/30 bg-emerald-500/10 text-emerald-100"
              : notice.tone === "error"
                ? "border-rose-300/30 bg-rose-500/10 text-rose-100"
                : "border-cyan-300/30 bg-cyan-500/10 text-cyan-100"
          }`}
        >
          {notice.message}
        </div>
      ) : null}

      {mode === "create" && step === 0 ? (
        <section className="space-y-4 rounded-2xl border border-[var(--surface-stroke)] bg-[var(--surface-2)] p-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--text-soft)]" htmlFor="connector-search">
              Search connectors
            </label>
            <input
              className="w-full rounded-lg border border-[var(--surface-stroke)] bg-[var(--surface-3)] px-3 py-2 text-sm text-[var(--text-strong)] outline-none focus:border-cyan-300/50"
              id="connector-search"
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by name, id, or tag"
              value={searchTerm}
            />
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">Source Connector</h4>
              <div className="max-h-[360px] space-y-2 overflow-auto rounded-xl border border-[var(--surface-stroke)] bg-[var(--surface-3)] p-2">
                {sourceOptions.map((connector) => (
                  <button
                    className={`block w-full rounded-lg border px-3 py-2 text-left ${
                      sourceConnectorName === connector.name
                        ? "border-cyan-300/40 bg-cyan-500/10"
                        : "border-transparent hover:border-[var(--surface-stroke)] hover:bg-[var(--surface-2)]"
                    }`}
                    key={connector.name}
                    onClick={() => setSourceConnectorName(connector.name)}
                    type="button"
                  >
                    <p className="text-sm font-medium text-[var(--text-strong)]">{connector.title}</p>
                    <p className="text-xs text-[var(--muted)]">{connector.description}</p>
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">Destination Connector</h4>
              <div className="max-h-[360px] space-y-2 overflow-auto rounded-xl border border-[var(--surface-stroke)] bg-[var(--surface-3)] p-2">
                {destinationOptions.map((connector) => (
                  <button
                    className={`block w-full rounded-lg border px-3 py-2 text-left ${
                      destinationConnectorName === connector.name
                        ? "border-emerald-300/40 bg-emerald-500/10"
                        : "border-transparent hover:border-[var(--surface-stroke)] hover:bg-[var(--surface-2)]"
                    }`}
                    key={connector.name}
                    onClick={() => setDestinationConnectorName(connector.name)}
                    type="button"
                  >
                    <p className="text-sm font-medium text-[var(--text-strong)]">{connector.title}</p>
                    <p className="text-xs text-[var(--muted)]">{connector.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {(mode === "edit" && step === 0) || (mode === "create" && step === 1) ? (
        <section className="space-y-4 rounded-2xl border border-[var(--surface-stroke)] bg-[var(--surface-2)] p-5">
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
                  Source: {sourceConnector?.title ?? sourceConnectorName}
                </h4>
              </div>
              {sourceConnector ? (
                <SchemaForm
                  errors={sourceErrors}
                  idPrefix="source"
                  onChange={setSourceConfig}
                  schema={sourceConnector.config_schema}
                  value={sourceConfig}
                />
              ) : (
                <p className="text-sm text-[var(--danger)]">Select a source connector first.</p>
              )}
              {sourceErrors._form ? <p className="text-xs text-[var(--danger)]">{sourceErrors._form}</p> : null}
            </div>
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
                  Destination: {destinationConnector?.title ?? destinationConnectorName}
                </h4>
              </div>
              {destinationConnector ? (
                <SchemaForm
                  errors={destinationErrors}
                  idPrefix="destination"
                  onChange={setDestinationConfig}
                  schema={destinationConnector.config_schema}
                  value={destinationConfig}
                />
              ) : (
                <p className="text-sm text-[var(--danger)]">Select a destination connector first.</p>
              )}
              {destinationErrors._form ? <p className="text-xs text-[var(--danger)]">{destinationErrors._form}</p> : null}
            </div>
          </div>
          <div className="flex justify-end">
            <button
              className="rounded-lg border border-cyan-300/40 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-100 hover:bg-cyan-500/20 disabled:opacity-60"
              disabled={isValidating}
              onClick={validateConfigs}
              type="button"
            >
              {isValidating ? "Validating..." : "Validate Connector Config"}
            </button>
          </div>
        </section>
      ) : null}

      {(mode === "create" && step === 2) || (mode === "edit" && step === 1) ? (
        <section className="space-y-5 rounded-2xl border border-[var(--surface-stroke)] bg-[var(--surface-2)] p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm text-[var(--text-soft)]">
              Pipeline Name
              <input
                className="w-full rounded-lg border border-[var(--surface-stroke)] bg-[var(--surface-3)] px-3 py-2 text-sm text-[var(--text-strong)] outline-none focus:border-cyan-300/50"
                onChange={(event) => setName(event.target.value)}
                value={name}
              />
            </label>
            <label className="space-y-1 text-sm text-[var(--text-soft)]">
              Schedule (Cron)
              <input
                className="w-full rounded-lg border border-[var(--surface-stroke)] bg-[var(--surface-3)] px-3 py-2 text-sm text-[var(--text-strong)] outline-none focus:border-cyan-300/50"
                onChange={(event) => setScheduleCron(event.target.value)}
                placeholder="0 0 * * *"
                value={scheduleCron}
              />
            </label>
            <label className="space-y-1 text-sm text-[var(--text-soft)]">
              Replication Mode
              <select
                className="w-full rounded-lg border border-[var(--surface-stroke)] bg-[var(--surface-3)] px-3 py-2 text-sm text-[var(--text-strong)] outline-none focus:border-cyan-300/50"
                onChange={(event) => setReplicationMode(event.target.value as ReplicationMode)}
                value={replicationMode}
              >
                <option value="full_table">Full Table</option>
                <option value="incremental_key">Incremental Key</option>
                <option value="log_based">Log Based</option>
              </select>
            </label>
            <label className="space-y-1 text-sm text-[var(--text-soft)]">
              Batch Size
              <input
                className="w-full rounded-lg border border-[var(--surface-stroke)] bg-[var(--surface-3)] px-3 py-2 text-sm text-[var(--text-strong)] outline-none focus:border-cyan-300/50"
                min={1}
                onChange={(event) => setBatchSize(Number(event.target.value))}
                type="number"
                value={batchSize}
              />
            </label>
            <label className="space-y-1 text-sm text-[var(--text-soft)] md:col-span-2">
              Description
              <textarea
                className="min-h-[90px] w-full rounded-lg border border-[var(--surface-stroke)] bg-[var(--surface-3)] px-3 py-2 text-sm text-[var(--text-strong)] outline-none focus:border-cyan-300/50"
                onChange={(event) => setDescription(event.target.value)}
                value={description}
              />
            </label>
            {replicationMode === "incremental_key" ? (
              <label className="space-y-1 text-sm text-[var(--text-soft)]">
                Incremental Key
                <input
                  className="w-full rounded-lg border border-[var(--surface-stroke)] bg-[var(--surface-3)] px-3 py-2 text-sm text-[var(--text-strong)] outline-none focus:border-cyan-300/50"
                  onChange={(event) => setIncrementalKey(event.target.value)}
                  placeholder="updated_at"
                  value={incrementalKey}
                />
              </label>
            ) : null}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-lg border border-[var(--surface-stroke)] bg-[var(--surface-3)] p-4">
              <h4 className="text-sm font-semibold text-[var(--text-strong)]">Source Config Preview</h4>
              <pre className="mt-2 overflow-auto text-xs text-[var(--text-soft)]">
                {JSON.stringify(maskConfigValues(sourceConnector, sourceConfig), null, 2)}
              </pre>
            </div>
            <div className="rounded-lg border border-[var(--surface-stroke)] bg-[var(--surface-3)] p-4">
              <h4 className="text-sm font-semibold text-[var(--text-strong)]">Destination Config Preview</h4>
              <pre className="mt-2 overflow-auto text-xs text-[var(--text-soft)]">
                {JSON.stringify(maskConfigValues(destinationConnector, destinationConfig), null, 2)}
              </pre>
            </div>
          </div>
        </section>
      ) : null}

      <footer className="flex flex-wrap items-center justify-between gap-3">
        <button
          className="rounded-lg border border-[var(--surface-stroke)] px-4 py-2 text-sm text-[var(--text-soft)] hover:bg-[var(--surface-3)] disabled:opacity-50"
          disabled={step === 0}
          onClick={() => setStep((current) => Math.max(0, current - 1))}
          type="button"
        >
          Back
        </button>
        <div className="flex gap-2">
          {step < totalSteps - 1 ? (
            <button
              className="rounded-lg border border-cyan-300/40 bg-cyan-500/15 px-4 py-2 text-sm text-cyan-100 hover:bg-cyan-500/25 disabled:opacity-50"
              disabled={
                (mode === "create" && step === 0 && (!sourceConnector || !destinationConnector)) ||
                (mode === "create" && step === 1 && isValidating) ||
                (mode === "edit" && step === 0 && isValidating)
              }
              onClick={async () => {
                if ((mode === "create" && step === 1) || (mode === "edit" && step === 0)) {
                  const valid = await validateConfigs();
                  if (!valid) {
                    return;
                  }
                }
                setStep((current) => Math.min(totalSteps - 1, current + 1));
              }}
              type="button"
            >
              Continue
            </button>
          ) : (
            <button
              className="rounded-lg border border-emerald-300/40 bg-emerald-500/15 px-5 py-2 text-sm text-emerald-100 hover:bg-emerald-500/25 disabled:opacity-50"
              disabled={isSubmitting || name.trim().length === 0}
              onClick={submit}
              type="button"
            >
              {isSubmitting ? "Saving..." : mode === "create" ? "Create Pipeline" : "Save Changes"}
            </button>
          )}
        </div>
      </footer>
    </section>
  );
}

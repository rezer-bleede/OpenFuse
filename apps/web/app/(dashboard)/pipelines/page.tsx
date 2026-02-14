"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  ApiError,
  deletePipeline,
  listPipelines,
  runPipeline,
  type PipelineStatus,
  updatePipeline,
} from "@/app/lib/api";
import { listConnectors, type Connector } from "@/app/lib/connectors";

const STATUS_OPTIONS: Array<{ value: "all" | PipelineStatus; label: string }> = [
  { value: "all", label: "All statuses" },
  { value: "draft", label: "Draft" },
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "failed", label: "Failed" },
];

const statusTone = (status: PipelineStatus): string => {
  switch (status) {
    case "active":
      return "border-emerald-300/40 bg-emerald-500/10 text-emerald-100";
    case "failed":
      return "border-rose-300/40 bg-rose-500/10 text-rose-100";
    case "paused":
      return "border-amber-300/40 bg-amber-500/10 text-amber-100";
    default:
      return "border-cyan-300/30 bg-cyan-500/10 text-cyan-100";
  }
};

export default function PipelinesPage() {
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [pipelines, setPipelines] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<"all" | PipelineStatus>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [notice, setNotice] = useState<{ tone: "error" | "success"; message: string } | null>(null);

  const connectorMap = useMemo(() => {
    const map = new Map<string, Connector>();
    connectors.forEach((connector) => map.set(connector.name, connector));
    return map;
  }, [connectors]);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setNotice(null);
    try {
      const [connectorsResponse, pipelineResponse] = await Promise.all([
        listConnectors(),
        listPipelines(statusFilter === "all" ? undefined : statusFilter),
      ]);
      setConnectors(connectorsResponse);
      setPipelines(pipelineResponse.pipelines);
    } catch (error) {
      setNotice({
        tone: "error",
        message: error instanceof Error ? error.message : "Failed to load pipelines.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const filteredPipelines = useMemo(() => {
    if (searchTerm.trim().length === 0) {
      return pipelines;
    }
    const needle = searchTerm.toLowerCase();
    return pipelines.filter((pipeline) => {
      const source = connectorMap.get(pipeline.source_connector)?.title ?? pipeline.source_connector;
      const destination = connectorMap.get(pipeline.destination_connector)?.title ?? pipeline.destination_connector;
      return (
        pipeline.name.toLowerCase().includes(needle) ||
        source.toLowerCase().includes(needle) ||
        destination.toLowerCase().includes(needle)
      );
    });
  }, [connectorMap, pipelines, searchTerm]);

  const mutate = async (action: () => Promise<void>, successMessage: string) => {
    setIsMutating(true);
    setNotice(null);
    try {
      await action();
      setNotice({ tone: "success", message: successMessage });
      await refresh();
    } catch (error) {
      setNotice({
        tone: "error",
        message: error instanceof ApiError ? error.message : "Pipeline action failed.",
      });
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--surface-stroke)] bg-[var(--surface-2)] p-5 shadow-panel">
        <div>
          <h3 className="text-xl font-semibold text-[var(--text-strong)]">Pipeline Inventory</h3>
          <p className="text-sm text-[var(--muted)]">Create, activate, pause, run, and inspect pipelines.</p>
        </div>
        <Link
          className="rounded-lg border border-cyan-300/40 bg-cyan-500/15 px-4 py-2 text-sm text-cyan-100 hover:bg-cyan-500/25"
          href="/pipelines/new"
        >
          New Pipeline
        </Link>
      </header>

      <div className="grid gap-4 rounded-2xl border border-[var(--surface-stroke)] bg-[var(--surface-2)] p-5 md:grid-cols-[2fr_1fr]">
        <label className="space-y-1 text-sm text-[var(--text-soft)]">
          Search
          <input
            className="w-full rounded-lg border border-[var(--surface-stroke)] bg-[var(--surface-3)] px-3 py-2 text-sm text-[var(--text-strong)] outline-none focus:border-cyan-300/50"
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by name or connector"
            value={searchTerm}
          />
        </label>
        <label className="space-y-1 text-sm text-[var(--text-soft)]">
          Status
          <select
            className="w-full rounded-lg border border-[var(--surface-stroke)] bg-[var(--surface-3)] px-3 py-2 text-sm text-[var(--text-strong)] outline-none focus:border-cyan-300/50"
            onChange={(event) => setStatusFilter(event.target.value as "all" | PipelineStatus)}
            value={statusFilter}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {notice ? (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            notice.tone === "success"
              ? "border-emerald-300/30 bg-emerald-500/10 text-emerald-100"
              : "border-rose-300/30 bg-rose-500/10 text-rose-100"
          }`}
        >
          {notice.message}
        </div>
      ) : null}

      {isLoading ? (
        <p className="text-sm text-[var(--muted)]">Loading pipelines...</p>
      ) : filteredPipelines.length === 0 ? (
        <div className="rounded-2xl border border-[var(--surface-stroke)] bg-[var(--surface-2)] p-8 text-center text-sm text-[var(--muted)]">
          No pipelines found for the selected filters.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPipelines.map((pipeline) => {
            const sourceTitle = connectorMap.get(pipeline.source_connector)?.title ?? pipeline.source_connector;
            const destinationTitle =
              connectorMap.get(pipeline.destination_connector)?.title ?? pipeline.destination_connector;
            return (
              <article
                className="rounded-2xl border border-[var(--surface-stroke)] bg-[var(--surface-2)] p-5 shadow-panel"
                key={pipeline.id}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-semibold text-[var(--text-strong)]">{pipeline.name}</h4>
                      <span className={`rounded-full border px-2 py-1 text-xs uppercase ${statusTone(pipeline.status)}`}>
                        {pipeline.status}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--text-soft)]">
                      {sourceTitle} → {destinationTitle}
                    </p>
                    <p className="text-xs text-[var(--muted)]">
                      Updated {new Date(pipeline.updated_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      className="rounded-lg border border-[var(--surface-stroke)] px-3 py-2 text-xs text-[var(--text-soft)] hover:bg-[var(--surface-3)]"
                      href={`/pipelines/${pipeline.id}`}
                    >
                      View
                    </Link>
                    <Link
                      className="rounded-lg border border-[var(--surface-stroke)] px-3 py-2 text-xs text-[var(--text-soft)] hover:bg-[var(--surface-3)]"
                      href={`/pipelines/${pipeline.id}/edit`}
                    >
                      Edit
                    </Link>
                    <button
                      className="rounded-lg border border-cyan-300/40 bg-cyan-500/10 px-3 py-2 text-xs text-cyan-100 hover:bg-cyan-500/20 disabled:opacity-60"
                      disabled={isMutating || pipeline.status !== "active"}
                      onClick={() =>
                        mutate(() => runPipeline(pipeline.id).then(() => undefined), `Pipeline "${pipeline.name}" queued.`)
                      }
                      type="button"
                    >
                      Run
                    </button>
                    <button
                      className="rounded-lg border border-amber-300/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-100 hover:bg-amber-500/20 disabled:opacity-60"
                      disabled={isMutating}
                      onClick={() =>
                        mutate(
                          () =>
                            updatePipeline(pipeline.id, {
                              status: pipeline.status === "active" ? "paused" : "active",
                            }).then(() => undefined),
                          pipeline.status === "active"
                            ? `Pipeline "${pipeline.name}" paused.`
                            : `Pipeline "${pipeline.name}" activated.`,
                        )
                      }
                      type="button"
                    >
                      {pipeline.status === "active" ? "Pause" : "Activate"}
                    </button>
                    <button
                      className="rounded-lg border border-rose-300/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-100 hover:bg-rose-500/20 disabled:opacity-60"
                      disabled={isMutating}
                      onClick={() =>
                        mutate(() => deletePipeline(pipeline.id), `Pipeline "${pipeline.name}" deleted.`)
                      }
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

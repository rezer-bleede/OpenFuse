"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  ApiError,
  getPipeline,
  listPipelineJobs,
  runPipeline,
  type JobSummary,
  type PipelineDetail,
  updatePipeline,
} from "@/app/lib/api";
import { listConnectors, type Connector } from "@/app/lib/connectors";

const maskSensitive = (connector: Connector | null, config: Record<string, unknown>) => {
  if (!connector) {
    return config;
  }
  const masked: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(config)) {
    if (connector.config_schema.properties[key]?.format === "password") {
      masked[key] = "********";
    } else {
      masked[key] = value;
    }
  }
  return masked;
};

export default function PipelineDetailPage() {
  const params = useParams<{ id: string }>();
  const pipelineId = Number(params.id);

  const [pipeline, setPipeline] = useState<PipelineDetail | null>(null);
  const [jobs, setJobs] = useState<JobSummary[]>([]);
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [notice, setNotice] = useState<{ tone: "error" | "success"; message: string } | null>(null);

  const connectorMap = useMemo(() => {
    const map = new Map<string, Connector>();
    connectors.forEach((connector) => map.set(connector.name, connector));
    return map;
  }, [connectors]);

  const sourceConnector = pipeline ? connectorMap.get(pipeline.source_connector) ?? null : null;
  const destinationConnector = pipeline ? connectorMap.get(pipeline.destination_connector) ?? null : null;

  const refresh = useCallback(async () => {
    if (!Number.isFinite(pipelineId)) {
      return;
    }

    setIsLoading(true);
    try {
      const [pipelineResponse, jobsResponse, connectorsResponse] = await Promise.all([
        getPipeline(pipelineId),
        listPipelineJobs(pipelineId),
        listConnectors(),
      ]);
      setPipeline(pipelineResponse);
      setJobs(jobsResponse.jobs);
      setConnectors(connectorsResponse);
    } catch (error) {
      setNotice({
        tone: "error",
        message: error instanceof Error ? error.message : "Unable to load pipeline details.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [pipelineId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

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
        message: error instanceof ApiError ? error.message : "Action failed.",
      });
    } finally {
      setIsMutating(false);
    }
  };

  if (isLoading) {
    return <p className="text-sm text-[var(--muted)]">Loading pipeline details...</p>;
  }

  if (!pipeline) {
    return <p className="text-sm text-[var(--danger)]">Pipeline not found.</p>;
  }

  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-[var(--surface-stroke)] bg-[var(--surface-2)] p-5 shadow-panel">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold text-[var(--text-strong)]">{pipeline.name}</h3>
            <p className="text-sm text-[var(--text-soft)]">
              {(sourceConnector?.title ?? pipeline.source_connector)} →{" "}
              {(destinationConnector?.title ?? pipeline.destination_connector)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              className="rounded-lg border border-[var(--surface-stroke)] px-3 py-2 text-xs text-[var(--text-soft)] hover:bg-[var(--surface-3)]"
              href={`/pipelines/${pipeline.id}/edit`}
            >
              Edit
            </Link>
            <button
              className="rounded-lg border border-cyan-300/40 bg-cyan-500/10 px-3 py-2 text-xs text-cyan-100 hover:bg-cyan-500/20 disabled:opacity-60"
              disabled={isMutating || pipeline.status !== "active"}
              onClick={() => mutate(() => runPipeline(pipeline.id).then(() => undefined), "Pipeline run queued.")}
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
                  pipeline.status === "active" ? "Pipeline paused." : "Pipeline activated.",
                )
              }
              type="button"
            >
              {pipeline.status === "active" ? "Pause" : "Activate"}
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <div className="rounded-lg border border-[var(--surface-stroke)] bg-[var(--surface-3)] p-3">
            <p className="text-xs text-[var(--muted)]">Status</p>
            <p className="text-sm text-[var(--text-strong)]">{pipeline.status}</p>
          </div>
          <div className="rounded-lg border border-[var(--surface-stroke)] bg-[var(--surface-3)] p-3">
            <p className="text-xs text-[var(--muted)]">Replication</p>
            <p className="text-sm text-[var(--text-strong)]">{pipeline.replication_mode}</p>
          </div>
          <div className="rounded-lg border border-[var(--surface-stroke)] bg-[var(--surface-3)] p-3">
            <p className="text-xs text-[var(--muted)]">Batch Size</p>
            <p className="text-sm text-[var(--text-strong)]">{pipeline.batch_size}</p>
          </div>
          <div className="rounded-lg border border-[var(--surface-stroke)] bg-[var(--surface-3)] p-3">
            <p className="text-xs text-[var(--muted)]">Updated</p>
            <p className="text-sm text-[var(--text-strong)]">{new Date(pipeline.updated_at).toLocaleString()}</p>
          </div>
        </div>
      </header>

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

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-[var(--surface-stroke)] bg-[var(--surface-2)] p-4">
          <h4 className="text-sm font-semibold text-[var(--text-strong)]">Source Config</h4>
          <pre className="mt-2 overflow-auto text-xs text-[var(--text-soft)]">
            {JSON.stringify(maskSensitive(sourceConnector, pipeline.source_config), null, 2)}
          </pre>
        </article>
        <article className="rounded-2xl border border-[var(--surface-stroke)] bg-[var(--surface-2)] p-4">
          <h4 className="text-sm font-semibold text-[var(--text-strong)]">Destination Config</h4>
          <pre className="mt-2 overflow-auto text-xs text-[var(--text-soft)]">
            {JSON.stringify(maskSensitive(destinationConnector, pipeline.destination_config), null, 2)}
          </pre>
        </article>
      </section>

      <section className="rounded-2xl border border-[var(--surface-stroke)] bg-[var(--surface-2)] p-4">
        <h4 className="text-sm font-semibold text-[var(--text-strong)]">Recent Jobs</h4>
        <div className="mt-3 overflow-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-[var(--muted)]">
              <tr>
                <th className="px-3 py-2">Job ID</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Rows</th>
                <th className="px-3 py-2">Started</th>
                <th className="px-3 py-2">Completed</th>
              </tr>
            </thead>
            <tbody>
              {jobs.length === 0 ? (
                <tr>
                  <td className="px-3 py-4 text-[var(--muted)]" colSpan={5}>
                    No jobs recorded yet.
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr className="border-t border-[var(--surface-stroke)]" key={job.id}>
                    <td className="px-3 py-3 text-[var(--text-strong)]">#{job.id}</td>
                    <td className="px-3 py-3 text-[var(--text-soft)]">{job.status}</td>
                    <td className="px-3 py-3 text-[var(--text-soft)]">{job.rows_synced}</td>
                    <td className="px-3 py-3 text-[var(--text-soft)]">
                      {job.started_at ? new Date(job.started_at).toLocaleString() : "—"}
                    </td>
                    <td className="px-3 py-3 text-[var(--text-soft)]">
                      {job.completed_at ? new Date(job.completed_at).toLocaleString() : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}

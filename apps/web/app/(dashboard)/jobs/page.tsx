"use client";

import { useEffect, useMemo, useState } from "react";

import { listJobs, type JobStatus } from "@/app/lib/api";

const FILTERS: Array<{ value: "all" | JobStatus; label: string }> = [
  { value: "all", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "running", label: "Running" },
  { value: "completed", label: "Completed" },
  { value: "failed", label: "Failed" },
  { value: "cancelled", label: "Cancelled" },
];

export default function JobsPage() {
  const [statusFilter, setStatusFilter] = useState<"all" | JobStatus>("all");
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await listJobs({
          status: statusFilter === "all" ? undefined : statusFilter,
        });
        setJobs(response.jobs);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load jobs.");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [statusFilter]);

  const stats = useMemo(() => {
    const totalRuns = jobs.length;
    const successful = jobs.filter((job) => job.status === "completed").length;
    const failed = jobs.filter((job) => job.status === "failed").length;
    const totalRows = jobs.reduce((sum, job) => sum + (job.rows_synced ?? 0), 0);
    return { totalRuns, successful, failed, totalRows };
  }, [jobs]);

  return (
    <section className="space-y-6">
      <header className="rounded-2xl border border-[var(--surface-stroke)] bg-[var(--surface-2)] p-5 shadow-panel">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold text-[var(--text-strong)]">Job Operations</h3>
            <p className="text-sm text-[var(--muted)]">Track execution health and row movement over time.</p>
          </div>
          <label className="space-y-1 text-sm text-[var(--text-soft)]">
            Status
            <select
              className="w-[180px] rounded-lg border border-[var(--surface-stroke)] bg-[var(--surface-3)] px-3 py-2 text-sm text-[var(--text-strong)] outline-none focus:border-cyan-300/50"
              onChange={(event) => setStatusFilter(event.target.value as "all" | JobStatus)}
              value={statusFilter}
            >
              {FILTERS.map((filter) => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-[var(--surface-stroke)] bg-[var(--surface-2)] p-4">
          <p className="text-xs text-[var(--muted)]">Total Runs</p>
          <p className="mt-1 text-2xl font-semibold text-[var(--text-strong)]">{stats.totalRuns}</p>
        </div>
        <div className="rounded-xl border border-emerald-300/30 bg-emerald-500/10 p-4">
          <p className="text-xs text-emerald-200">Successful</p>
          <p className="mt-1 text-2xl font-semibold text-emerald-100">{stats.successful}</p>
        </div>
        <div className="rounded-xl border border-rose-300/30 bg-rose-500/10 p-4">
          <p className="text-xs text-rose-200">Failed</p>
          <p className="mt-1 text-2xl font-semibold text-rose-100">{stats.failed}</p>
        </div>
        <div className="rounded-xl border border-cyan-300/30 bg-cyan-500/10 p-4">
          <p className="text-xs text-cyan-200">Rows Synced</p>
          <p className="mt-1 text-2xl font-semibold text-cyan-100">{stats.totalRows}</p>
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-rose-300/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">{error}</div>
      ) : null}

      <div className="overflow-auto rounded-2xl border border-[var(--surface-stroke)] bg-[var(--surface-2)]">
        <table className="w-full min-w-[760px]">
          <thead className="border-b border-[var(--surface-stroke)] bg-[var(--surface-3)]">
            <tr className="text-xs uppercase tracking-wide text-[var(--muted)]">
              <th className="px-4 py-3 text-left">Job ID</th>
              <th className="px-4 py-3 text-left">Pipeline</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Rows Synced</th>
              <th className="px-4 py-3 text-left">Started</th>
              <th className="px-4 py-3 text-left">Completed</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td className="px-4 py-6 text-sm text-[var(--muted)]" colSpan={6}>
                  Loading jobs...
                </td>
              </tr>
            ) : jobs.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-sm text-[var(--muted)]" colSpan={6}>
                  No jobs yet. Run an active pipeline to start collecting execution history.
                </td>
              </tr>
            ) : (
              jobs.map((job) => (
                <tr className="border-t border-[var(--surface-stroke)] text-sm" key={job.id}>
                  <td className="px-4 py-3 text-[var(--text-strong)]">#{job.id}</td>
                  <td className="px-4 py-3 text-[var(--text-soft)]">Pipeline #{job.pipeline_id}</td>
                  <td className="px-4 py-3 text-[var(--text-soft)]">{job.status}</td>
                  <td className="px-4 py-3 text-[var(--text-soft)]">{job.rows_synced}</td>
                  <td className="px-4 py-3 text-[var(--text-soft)]">
                    {job.started_at ? new Date(job.started_at).toLocaleString() : "—"}
                  </td>
                  <td className="px-4 py-3 text-[var(--text-soft)]">
                    {job.completed_at ? new Date(job.completed_at).toLocaleString() : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

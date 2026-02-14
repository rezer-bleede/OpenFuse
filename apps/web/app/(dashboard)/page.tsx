"use client";

import { useEffect, useMemo, useState } from "react";

import { listConnectors, type Connector, type ConnectorCapability } from "@/app/lib/connectors";

export default function ConnectorsPage() {
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [capability, setCapability] = useState<"all" | ConnectorCapability>("all");
  const [selectedTag, setSelectedTag] = useState("all");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await listConnectors();
        setConnectors(response);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load connectors.");
      }
    };
    load();
  }, []);

  const tags = useMemo(() => {
    const set = new Set<string>();
    connectors.forEach((connector) => connector.tags.forEach((tag) => set.add(tag)));
    return ["all", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [connectors]);

  const filteredConnectors = useMemo(
    () =>
      connectors.filter((connector) => {
        if (capability !== "all" && !connector.capabilities.includes(capability)) {
          return false;
        }
        if (selectedTag !== "all" && !connector.tags.includes(selectedTag)) {
          return false;
        }
        if (searchTerm.trim().length === 0) {
          return true;
        }
        const needle = searchTerm.toLowerCase();
        return (
          connector.title.toLowerCase().includes(needle) ||
          connector.name.toLowerCase().includes(needle) ||
          connector.description.toLowerCase().includes(needle) ||
          connector.tags.some((tag) => tag.toLowerCase().includes(needle))
        );
      }),
    [capability, connectors, searchTerm, selectedTag],
  );

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-[var(--surface-stroke)] bg-[var(--surface-2)] p-5 shadow-panel">
        <div className="grid gap-4 lg:grid-cols-[2fr_1fr_1fr]">
          <label className="space-y-1 text-sm text-[var(--text-soft)]">
            Search
            <input
              className="w-full rounded-lg border border-[var(--surface-stroke)] bg-[var(--surface-3)] px-3 py-2 text-sm text-[var(--text-strong)] outline-none focus:border-cyan-300/60"
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Find connectors by name, id, or tags"
              value={searchTerm}
            />
          </label>
          <label className="space-y-1 text-sm text-[var(--text-soft)]">
            Capability
            <select
              className="w-full rounded-lg border border-[var(--surface-stroke)] bg-[var(--surface-3)] px-3 py-2 text-sm text-[var(--text-strong)] outline-none focus:border-cyan-300/60"
              onChange={(event) => setCapability(event.target.value as "all" | ConnectorCapability)}
              value={capability}
            >
              <option value="all">All</option>
              <option value="source">Source</option>
              <option value="destination">Destination</option>
            </select>
          </label>
          <label className="space-y-1 text-sm text-[var(--text-soft)]">
            Tag
            <select
              className="w-full rounded-lg border border-[var(--surface-stroke)] bg-[var(--surface-3)] px-3 py-2 text-sm text-[var(--text-strong)] outline-none focus:border-cyan-300/60"
              onChange={(event) => setSelectedTag(event.target.value)}
              value={selectedTag}
            >
              {tags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-rose-300/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">{error}</div>
      ) : null}

      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--muted)]">Showing {filteredConnectors.length} connectors</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredConnectors.map((connector) => (
          <article
            className="flex h-full flex-col rounded-2xl border border-[var(--surface-stroke)] bg-[var(--surface-2)] p-5 shadow-panel"
            key={connector.name}
          >
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-[var(--text-strong)]">{connector.title}</h3>
              <p className="text-sm text-[var(--text-soft)]">{connector.description}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {connector.capabilities.map((item) => (
                <span
                  className={`rounded-full border px-2 py-1 text-[10px] uppercase tracking-wider ${
                    item === "source"
                      ? "border-cyan-300/30 bg-cyan-500/10 text-cyan-100"
                      : "border-emerald-300/30 bg-emerald-500/10 text-emerald-100"
                  }`}
                  key={`${connector.name}-${item}`}
                >
                  {item}
                </span>
              ))}
              {connector.tags.slice(0, 4).map((tag) => (
                <span
                  className="rounded-full border border-[var(--surface-stroke)] bg-[var(--surface-3)] px-2 py-1 text-[10px] uppercase tracking-wide text-[var(--text-soft)]"
                  key={`${connector.name}-${tag}`}
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-4 text-xs text-[var(--muted)]">{connector.name}</div>
          </article>
        ))}
      </div>
    </section>
  );
}

"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { loadConnectors, getApiUrl, type Connector } from "../../lib/connectors";

export default function NewPipelinePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sourceName = searchParams.get("source");
  const destName = searchParams.get("dest");

  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [sourceConnector, setSourceConnector] = useState<Connector | null>(null);
  const [destConnector, setDestConnector] = useState<Connector | null>(null);
  const [pipelineName, setPipelineName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    loadConnectors().then((loadedConnectors) => {
      setConnectors(loadedConnectors);
      const source = loadedConnectors.find((c) => c.name === sourceName);
      const dest = loadedConnectors.find((c) => c.name === destName);
      setSourceConnector(source || null);
      setDestConnector(dest || null);
      if (source && dest) {
        setPipelineName(`${source.title} to ${dest.title}`);
      }
    });
  }, [sourceName, destName]);

  const handleCreatePipeline = async () => {
    setIsCreating(true);
    try {
      let apiUrl = getApiUrl();
      if (!apiUrl) {
        apiUrl = "http://localhost:8000";
      } else {
        const url = new URL(apiUrl);
        if (url.hostname === "api") {
          apiUrl = "http://localhost:8000";
        }
      }

      const response = await fetch(`${apiUrl}/api/v1/pipelines`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: pipelineName,
          source_connector: sourceName,
          destination_connector: destName,
          source_config: {},
          destination_config: {},
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Failed to create pipeline: ${response.statusText}`);
      }

      const data = await response.json();
      alert("Pipeline created successfully!");
      router.push("/pipelines");
    } catch (error) {
      console.error("Error creating pipeline:", error);
      alert(error instanceof Error ? error.message : "Failed to create pipeline. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  if (!sourceConnector || !destConnector) {
    return (
      <section className="space-y-8">
        <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-6">
          <h3 className="text-lg font-semibold text-red-300">Invalid Configuration</h3>
          <p className="mt-2 text-sm text-red-200">
            Please select valid source and destination connectors.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">Create New Pipeline</h2>
        <p className="text-slate-300">
          Configure your data pipeline from {sourceConnector.title} to {destConnector.title}.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-6">
          <h4 className="text-sm font-medium text-blue-300 mb-2">Source</h4>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-blue-500/20 flex items-center justify-center text-blue-400 text-lg font-medium">
              {sourceConnector.title.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-slate-100">{sourceConnector.title}</p>
              <p className="text-xs text-slate-400">{sourceConnector.name}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="text-slate-400 text-2xl">→</div>
          </div>
        </div>

        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-6">
          <h4 className="text-sm font-medium text-emerald-300 mb-2">Destination</h4>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-lg font-medium">
              {destConnector.title.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-slate-100">{destConnector.title}</p>
              <p className="text-xs text-slate-400">{destConnector.name}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6 space-y-6">
        <div>
          <label htmlFor="pipelineName" className="block text-sm font-medium text-slate-200 mb-2">
            Pipeline Name
          </label>
          <input
            id="pipelineName"
            type="text"
            value={pipelineName}
            onChange={(e) => setPipelineName(e.target.value)}
            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter pipeline name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">
            Source Configuration
          </label>
          <div className="rounded-md bg-slate-800 p-4 border border-slate-700">
            <p className="text-sm text-slate-400">Configuration for {sourceConnector.title} will be added here.</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">
            Destination Configuration
          </label>
          <div className="rounded-md bg-slate-800 p-4 border border-slate-700">
            <p className="text-sm text-slate-400">Configuration for {destConnector.title} will be added here.</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-md text-sm font-medium transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={handleCreatePipeline}
          disabled={!pipelineName || isCreating}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-md text-sm font-medium transition-colors"
        >
          {isCreating ? "Creating..." : "Create Pipeline"}
        </button>
      </div>
    </section>
  );
}

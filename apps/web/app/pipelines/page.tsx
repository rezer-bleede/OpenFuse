import { loadConnectors, type Connector } from "./lib/connectors";

export default async function PipelinesPage() {
  const connectors = await loadConnectors();
  const sourceConnectors = connectors.filter(c => 
    !c.name.includes("destination") && c.name !== "example"
  );
  const destConnectors = connectors.filter(c => c.name.includes("destination") || ["snowflake", "bigquery", "redshift"].includes(c.name));

  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">Data Pipelines</h2>
        <p className="text-slate-300">
          Create and manage data pipelines to extract data from sources and load into destinations.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-50">Create New Pipeline</h3>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
            <h4 className="text-lg font-semibold text-slate-100 mb-4">Source</h4>
            <div className="space-y-2">
              {sourceConnectors.slice(0, 8).map((connector) => (
                <div key={connector.name} className="flex items-center gap-3 p-2 rounded hover:bg-slate-800/50 cursor-pointer transition-colors">
                  <div className="w-8 h-8 rounded bg-blue-500/20 flex items-center justify-center text-blue-400 text-sm font-medium">
                    {connector.title.charAt(0)}
                  </div>
                  <span className="text-sm text-slate-300">{connector.title}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
            <h4 className="text-lg font-semibold text-slate-100 mb-4">Destination</h4>
            <div className="space-y-2">
              {destConnectors.slice(0, 8).map((connector) => (
                <div key={connector.name} className="flex items-center gap-3 p-2 rounded hover:bg-slate-800/50 cursor-pointer transition-colors">
                  <div className="w-8 h-8 rounded bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm font-medium">
                    {connector.title.charAt(0)}
                  </div>
                  <span className="text-sm text-slate-300">{connector.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-slate-50">Quick Start Templates</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
            <h4 className="font-medium text-slate-100">PostgreSQL to Snowflake</h4>
            <p className="text-sm text-slate-400 mt-1">Replicate data from PostgreSQL to Snowflake</p>
            <button className="mt-3 text-sm text-blue-400 hover:text-blue-300">Use template →</button>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
            <h4 className="font-medium text-slate-100">Salesforce to BigQuery</h4>
            <p className="text-sm text-slate-400 mt-1">Sync CRM data to BigQuery</p>
            <button className="mt-3 text-sm text-blue-400 hover:text-blue-300">Use template →</button>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
            <h4 className="font-medium text-slate-100">S3 to Redshift</h4>
            <p className="text-sm text-slate-400 mt-1">Load files from S3 into Redshift</p>
            <button className="mt-3 text-sm text-blue-400 hover:text-blue-300">Use template →</button>
          </div>
        </div>
      </div>
    </section>
  );
}

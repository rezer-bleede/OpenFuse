type Connector = {
  name: string;
  title: string;
  description: string;
  tags: string[];
};

async function fetchConnectors(): Promise<Connector[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  try {
    const response = await fetch(`${apiUrl}/api/v1/connectors`, {
      // Disable Next.js caching so the dashboard always reflects the latest registry state.
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Failed to load connector metadata", await response.text());
      return [];
    }

    const payload = (await response.json()) as { connectors?: Connector[] };
    return payload.connectors ?? [];
  } catch (error) {
    console.error("Unable to reach API", error);
    return [];
  }
}

export default async function HomePage() {
  const connectors = await fetchConnectors();

  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">Build once, deliver everywhere.</h2>
        <p className="text-slate-300">
          OpenFuse unifies your integration workflows with an open-core foundation and optional enterprise extensions for
          regulated industries. Start with the community edition and layer commercial offerings without forking the codebase.
        </p>
      </div>

      <div className="space-y-4">
        <header className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-slate-50">Available connectors</h3>
            <p className="text-sm text-slate-400">Registered community integrations ready for configuration.</p>
          </div>
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
            {connectors.length} available
          </span>
        </header>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {connectors.length === 0 ? (
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
              <h4 className="text-lg font-semibold text-slate-100">No connectors registered</h4>
              <p className="mt-2 text-sm text-slate-400">
                Start the API service to sync the connector registry or add your own by extending the community package.
              </p>
            </div>
          ) : (
            connectors.map((connector) => (
              <article
                key={connector.name}
                className="flex h-full flex-col justify-between rounded-lg border border-slate-800 bg-slate-900/60 p-6"
              >
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold text-slate-100">{connector.title}</h4>
                  <p className="text-sm text-slate-400">{connector.description}</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {connector.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-slate-800 px-2 py-1 text-xs uppercase tracking-wide text-slate-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";

const navigation = [
  { name: "Pipelines", description: "Monitor and configure ingestion jobs.", href: "/pipelines" },
  { name: "Connectors", description: "Manage source and destination integrations.", href: "/connectors" },
  { name: "Observability", description: "View metrics, logs, and events.", href: "/observability" }
];

export default function HomePage() {
  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">Build once, deliver everywhere.</h2>
        <p className="text-slate-300">
          OpenFuse unifies your integration workflows with an open-core foundation and optional enterprise extensions for
          regulated industries. Start with the community edition and layer commercial offerings without forking the codebase.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 transition hover:border-slate-600"
          >
            <h3 className="text-lg font-semibold text-slate-50">{item.name}</h3>
            <p className="text-sm text-slate-400">{item.description}</p>
            <span className="mt-4 inline-block text-xs uppercase tracking-wide text-emerald-400">Coming soon</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

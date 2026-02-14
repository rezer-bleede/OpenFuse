"use client";

import { usePathname } from "next/navigation";

type TopHeaderProps = {
  onOpenNav: () => void;
};

const TITLES: Record<string, { title: string; subtitle: string }> = {
  "/": {
    title: "Connector Explorer",
    subtitle: "Discover source and destination integrations with capability-aware filtering.",
  },
  "/pipelines": {
    title: "Pipelines",
    subtitle: "Manage data pipelines from draft to execution.",
  },
  "/jobs": {
    title: "Jobs",
    subtitle: "Monitor runtime outcomes and diagnose failed runs quickly.",
  },
};

export function TopHeader({ onOpenNav }: TopHeaderProps) {
  const pathname = usePathname();

  const pageMeta =
    TITLES[pathname] ??
    (pathname.startsWith("/pipelines/")
      ? {
          title: "Pipeline Workspace",
          subtitle: "Configure connectors, validation, and execution behavior.",
        }
      : {
          title: "OpenFuse",
          subtitle: "Operational data integration workspace.",
        });

  return (
    <header className="sticky top-0 z-10 border-b border-[var(--surface-stroke)] bg-[var(--surface-1)]/95 px-4 py-4 backdrop-blur-md md:px-8">
      <div className="mx-auto flex w-full max-w-[1400px] items-center gap-4">
        <button
          className="rounded-lg border border-[var(--surface-stroke)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--text-soft)] md:hidden"
          onClick={onOpenNav}
          type="button"
        >
          Menu
        </button>
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-[var(--text-strong)] md:text-2xl">{pageMeta.title}</h2>
          <p className="text-xs text-[var(--muted)] md:text-sm">{pageMeta.subtitle}</p>
        </div>
      </div>
    </header>
  );
}

"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";

import { Footer } from "./Footer";
import { SideNav } from "./SideNav";
import { TopHeader } from "./TopHeader";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const links = useMemo(
    () => [
      { href: "/", label: "Connectors", hint: "Catalog and capabilities" },
      { href: "/pipelines", label: "Pipelines", hint: "Create and operate flows" },
      { href: "/jobs", label: "Jobs", hint: "Execution history" },
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-[var(--surface-1)] text-[var(--text)]">
      <div className="flex min-h-screen">
        <SideNav isOpen={isNavOpen} links={links} onClose={() => setIsNavOpen(false)} />
        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <TopHeader onOpenNav={() => setIsNavOpen(true)} />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </div>
    </div>
  );
}

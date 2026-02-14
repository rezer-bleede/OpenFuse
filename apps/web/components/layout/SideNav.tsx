"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLink = {
  href: string;
  label: string;
  hint: string;
};

type SideNavProps = {
  links: NavLink[];
  isOpen: boolean;
  onClose: () => void;
};

export function SideNav({ links, isOpen, onClose }: SideNavProps) {
  const pathname = usePathname();

  return (
    <>
      <button
        aria-label="Close navigation"
        className={`fixed inset-0 z-20 bg-slate-950/60 backdrop-blur-sm transition md:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        type="button"
      />
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-72 border-r border-[var(--surface-stroke)] bg-[var(--surface-2)] px-5 py-6 transition md:static md:z-0 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-1 pb-6">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">OpenFuse</p>
          <h1 className="text-xl font-semibold text-[var(--text-strong)]">Control Plane</h1>
        </div>
        <nav className="space-y-2">
          {links.map((link) => {
            const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block rounded-xl border px-4 py-3 transition ${
                  active
                    ? "border-cyan-300/30 bg-cyan-500/10 text-cyan-100"
                    : "border-transparent bg-transparent text-[var(--text-soft)] hover:border-[var(--surface-stroke)] hover:bg-[var(--surface-3)] hover:text-[var(--text-strong)]"
                }`}
                onClick={onClose}
              >
                <p className="text-sm font-medium">{link.label}</p>
                <p className="text-xs opacity-80">{link.hint}</p>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

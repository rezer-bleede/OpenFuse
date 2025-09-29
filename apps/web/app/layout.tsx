import "../styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OpenFuse",
  description: "Open-core data integration platform"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100">
        <div className="min-h-screen flex flex-col">
          <header className="border-b border-slate-800 px-6 py-4">
            <h1 className="text-xl font-semibold tracking-tight">OpenFuse Control Plane</h1>
            <p className="text-sm text-slate-400">
              Community edition dashboard &mdash; extend via enterprise plugins.
            </p>
          </header>
          <main className="flex-1 px-6 py-8">{children}</main>
          <footer className="border-t border-slate-800 px-6 py-4 text-xs text-slate-500">
            © {new Date().getFullYear()} OpenFuse. Community core licensed under Apache 2.0.
          </footer>
        </div>
      </body>
    </html>
  );
}

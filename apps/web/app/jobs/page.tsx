export default function JobsPage() {
  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold">Pipeline Jobs</h2>
        <p className="text-slate-300">
          Monitor and manage pipeline execution jobs.
        </p>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/60 overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-slate-800 bg-slate-800/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Job ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Pipeline</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Rows Synced</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Started</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Duration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            <tr>
              <td className="px-4 py-4 text-sm text-slate-300" colSpan={6}>
                <div className="text-center py-8 text-slate-500">
                  No jobs yet. Run a pipeline to see job history here.
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
          <div className="text-sm text-slate-400">Total Runs</div>
          <div className="text-2xl font-semibold text-slate-100 mt-1">0</div>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
          <div className="text-sm text-slate-400">Successful</div>
          <div className="text-2xl font-semibold text-emerald-400 mt-1">0</div>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
          <div className="text-sm text-slate-400">Failed</div>
          <div className="text-2xl font-semibold text-red-400 mt-1">0</div>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
          <div className="text-sm text-slate-400">Total Rows</div>
          <div className="text-2xl font-semibold text-blue-400 mt-1">0</div>
        </div>
      </div>
    </section>
  );
}

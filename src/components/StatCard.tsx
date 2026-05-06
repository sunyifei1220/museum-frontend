interface StatCardProps {
  title: string;
  value: string | number;
  hint?: string;
}

export default function StatCard({ title, value, hint }: StatCardProps) {
  return (
    <div className="panel">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
      {hint && <p className="mt-2 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

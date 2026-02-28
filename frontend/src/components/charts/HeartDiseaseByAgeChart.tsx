import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { Patient } from "../../backend";

interface Props {
  patients: Patient[];
}

const EMPTY_MSG = "No data available for the current filters.";

export default function HeartDiseaseByAgeChart({ patients }: Props) {
  if (!Array.isArray(patients) || patients.length === 0) {
    return <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">{EMPTY_MSG}</div>;
  }

  const bins: Record<string, { total: number; disease: number }> = {};
  for (const p of patients) {
    const age = Number(p.age);
    const bin = `${Math.floor(age / 10) * 10}s`;
    if (!bins[bin]) bins[bin] = { total: 0, disease: 0 };
    bins[bin].total++;
    if (p.heartDisease) bins[bin].disease++;
  }

  const data = Object.entries(bins)
    .sort(([a], [b]) => parseInt(a) - parseInt(b))
    .map(([bin, { total, disease }]) => ({
      bin,
      prevalence: total > 0 ? Math.round((disease / total) * 100) : 0,
    }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="bin" tick={{ fontSize: 12 }} />
        <YAxis unit="%" tick={{ fontSize: 12 }} domain={[0, 100]} />
        <Tooltip formatter={(v: number) => [`${v}%`, "Prevalence"]} />
        <Bar dataKey="prevalence" radius={[4, 4, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.prevalence >= 40 ? "var(--destructive)" : "var(--primary)"} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

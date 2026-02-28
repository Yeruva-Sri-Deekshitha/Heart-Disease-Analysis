import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { Patient } from "../../backend";

interface Props {
  patients: Patient[];
}

export default function CholesterolByAgeChart({ patients }: Props) {
  if (!Array.isArray(patients) || patients.length === 0) {
    return <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">No data available for the current filters.</div>;
  }

  const bins: Record<string, { sum: number; count: number }> = {};
  for (const p of patients) {
    const age = Number(p.age);
    const bin = `${Math.floor(age / 10) * 10}s`;
    if (!bins[bin]) bins[bin] = { sum: 0, count: 0 };
    bins[bin].sum += Number(p.cholesterol);
    bins[bin].count++;
  }

  const data = Object.entries(bins)
    .sort(([a], [b]) => parseInt(a) - parseInt(b))
    .map(([bin, { sum, count }]) => ({
      bin,
      avgCholesterol: count > 0 ? Math.round(sum / count) : 0,
      count,
    }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="bin" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} domain={["auto", "auto"]} />
        <Tooltip formatter={(v: number, name: string) => [v, name === "avgCholesterol" ? "Avg Cholesterol (mg/dL)" : name]} />
        <Bar dataKey="avgCholesterol" radius={[4, 4, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill="var(--primary)" />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

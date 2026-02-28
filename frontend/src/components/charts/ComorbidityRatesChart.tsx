import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { Patient } from "../../backend";

interface Props {
  patients: Patient[];
}

export default function ComorbidityRatesChart({ patients }: Props) {
  if (!Array.isArray(patients) || patients.length === 0) {
    return <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">No data available for the current filters.</div>;
  }

  const diseased = patients.filter((p) => p.heartDisease);
  const total = diseased.length;

  if (total === 0) {
    return <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">No heart disease patients in current filter.</div>;
  }

  const diabetesCount = diseased.filter((p) => p.diabetes).length;
  const strokeCount = diseased.filter((p) => p.strokeHistory).length;
  const bothCount = diseased.filter((p) => p.diabetes && p.strokeHistory).length;

  const data = [
    { name: "Diabetes", rate: Math.round((diabetesCount / total) * 100) },
    { name: "Stroke History", rate: Math.round((strokeCount / total) * 100) },
    { name: "Both", rate: Math.round((bothCount / total) * 100) },
  ];

  const colors = ["var(--primary)", "var(--destructive)", "oklch(0.55 0.12 185)"];

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis unit="%" tick={{ fontSize: 12 }} domain={[0, 100]} />
        <Tooltip formatter={(v: number) => [`${v}%`, "Rate"]} />
        <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={colors[i % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

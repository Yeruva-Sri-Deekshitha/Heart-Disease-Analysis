import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Patient } from "../../backend";

interface Props {
  patients: Patient[];
}

const LABELS: Record<string, string> = {
  normal: "Normal",
  fixedDefect: "Fixed Defect",
  reversibleDefect: "Reversible Defect",
};

const COLORS = ["var(--primary)", "var(--destructive)", "oklch(0.55 0.12 185)"];

export default function ThalassemiaDistributionChart({ patients }: Props) {
  if (!Array.isArray(patients) || patients.length === 0) {
    return <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">No data available for the current filters.</div>;
  }

  const counts: Record<string, number> = {};
  for (const p of patients) {
    const key = p.thal as string;
    counts[key] = (counts[key] ?? 0) + 1;
  }

  const data = Object.entries(counts).map(([type, value]) => ({
    name: LABELS[type] ?? type,
    value,
  }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(v: number) => [v, "Patients"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { Patient, Gender } from "../../backend";

interface Props {
  patients: Patient[];
}

export default function AnginaByGenderChart({ patients }: Props) {
  if (!Array.isArray(patients) || patients.length === 0) {
    return <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">No data available for the current filters.</div>;
  }

  const stats: Record<string, { total: number; angina: number }> = {
    Male: { total: 0, angina: 0 },
    Female: { total: 0, angina: 0 },
  };

  for (const p of patients) {
    const key = p.gender === Gender.male ? "Male" : "Female";
    stats[key].total++;
    if (p.exerciseInducedAngina) stats[key].angina++;
  }

  const data = Object.entries(stats).map(([gender, { total, angina }]) => ({
    gender,
    rate: total > 0 ? Math.round((angina / total) * 100) : 0,
  }));

  const colors = ["var(--primary)", "var(--destructive)"];

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="gender" tick={{ fontSize: 12 }} />
        <YAxis unit="%" tick={{ fontSize: 12 }} domain={[0, 100]} />
        <Tooltip formatter={(v: number) => [`${v}%`, "Angina Rate"]} />
        <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={colors[i % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

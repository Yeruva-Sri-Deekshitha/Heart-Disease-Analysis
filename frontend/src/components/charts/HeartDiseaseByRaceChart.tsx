import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { Patient } from "../../backend";

interface Props {
  patients: Patient[];
}

const RACE_LABELS: Record<string, string> = {
  black: "Black",
  white: "White",
  asian: "Asian",
  latino: "Latino",
  other: "Other",
};

const TEAL_SHADES = [
  "var(--primary)",
  "oklch(0.55 0.12 185)",
  "oklch(0.65 0.10 185)",
  "oklch(0.45 0.14 185)",
  "oklch(0.70 0.08 185)",
];

export default function HeartDiseaseByRaceChart({ patients }: Props) {
  if (!Array.isArray(patients) || patients.length === 0) {
    return <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">No data available for the current filters.</div>;
  }

  const stats: Record<string, { total: number; disease: number }> = {};
  for (const p of patients) {
    const key = p.race as string;
    if (!stats[key]) stats[key] = { total: 0, disease: 0 };
    stats[key].total++;
    if (p.heartDisease) stats[key].disease++;
  }

  const data = Object.entries(stats).map(([race, { total, disease }]) => ({
    race: RACE_LABELS[race] ?? race,
    prevalence: total > 0 ? Math.round((disease / total) * 100) : 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="race" tick={{ fontSize: 12 }} />
        <YAxis unit="%" tick={{ fontSize: 12 }} domain={[0, 100]} />
        <Tooltip formatter={(v: number) => [`${v}%`, "Prevalence"]} />
        <Bar dataKey="prevalence" radius={[4, 4, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={TEAL_SHADES[i % TEAL_SHADES.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

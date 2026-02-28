import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Patient } from "../../backend";

interface Props {
  patients: Patient[];
}

export default function AgeVsHeartRateChart({ patients }: Props) {
  if (!Array.isArray(patients) || patients.length === 0) {
    return <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">No data available for the current filters.</div>;
  }

  const sample = patients.length > 200 ? patients.filter((_, i) => i % Math.ceil(patients.length / 200) === 0) : patients;

  const diseased = sample.filter((p) => p.heartDisease).map((p) => ({ age: Number(p.age), hr: Number(p.maxHeartRate) }));
  const healthy = sample.filter((p) => !p.heartDisease).map((p) => ({ age: Number(p.age), hr: Number(p.maxHeartRate) }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <ScatterChart margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="age" name="Age" type="number" tick={{ fontSize: 12 }} label={{ value: "Age", position: "insideBottom", offset: -2, fontSize: 11 }} />
        <YAxis dataKey="hr" name="Max HR" type="number" tick={{ fontSize: 12 }} />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} formatter={(v: number, name: string) => [v, name === "age" ? "Age" : "Max HR"]} />
        <Legend />
        <Scatter name="Heart Disease" data={diseased} fill="var(--destructive)" opacity={0.7} />
        <Scatter name="Healthy" data={healthy} fill="var(--primary)" opacity={0.7} />
      </ScatterChart>
    </ResponsiveContainer>
  );
}

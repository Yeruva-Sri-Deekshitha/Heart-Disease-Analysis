import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Patient } from "../../backend";

interface Props {
  patients: Patient[];
}

export default function CholesterolVsBPChart({ patients }: Props) {
  if (!Array.isArray(patients) || patients.length === 0) {
    return <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">No data available for the current filters.</div>;
  }

  const sample = patients.length > 200 ? patients.filter((_, i) => i % Math.ceil(patients.length / 200) === 0) : patients;
  const data = sample.map((p) => ({ chol: Number(p.cholesterol), bp: Number(p.restingBP) }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <ScatterChart margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis dataKey="chol" name="Cholesterol" type="number" tick={{ fontSize: 12 }} label={{ value: "Cholesterol (mg/dL)", position: "insideBottom", offset: -2, fontSize: 11 }} />
        <YAxis dataKey="bp" name="Resting BP" type="number" tick={{ fontSize: 12 }} />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} formatter={(v: number, name: string) => [v, name === "chol" ? "Cholesterol" : "Resting BP"]} />
        <Scatter data={data} fill="var(--primary)" opacity={0.6} />
      </ScatterChart>
    </ResponsiveContainer>
  );
}

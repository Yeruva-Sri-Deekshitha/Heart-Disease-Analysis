import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { type Patient, ChestPainType, Gender, Race, Thalassemia } from '../backend';

export type SortKey = keyof Patient;
export type SortDir = 'asc' | 'desc';

interface PatientTableProps {
  patients: Patient[];
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
}

const CHEST_PAIN_LABELS: Record<ChestPainType, string> = {
  [ChestPainType.typicalAngina]: 'Typical Angina',
  [ChestPainType.atypicalAngina]: 'Atypical Angina',
  [ChestPainType.nonAnginalPain]: 'Non-Anginal',
  [ChestPainType.asymptomatic]: 'Asymptomatic',
};

const THAL_LABELS: Record<Thalassemia, string> = {
  [Thalassemia.normal]: 'Normal',
  [Thalassemia.fixedDefect]: 'Fixed Defect',
  [Thalassemia.reversibleDefect]: 'Reversible',
};

const COLUMNS: { key: SortKey; label: string; width?: string }[] = [
  { key: 'age', label: 'Age', width: 'w-14' },
  { key: 'gender', label: 'Gender', width: 'w-20' },
  { key: 'race', label: 'Race', width: 'w-20' },
  { key: 'chestPain', label: 'Chest Pain', width: 'w-32' },
  { key: 'restingBP', label: 'BP', width: 'w-16' },
  { key: 'cholesterol', label: 'Chol.', width: 'w-16' },
  { key: 'fastingBloodSugar', label: 'FBS', width: 'w-12' },
  { key: 'restingECG', label: 'ECG', width: 'w-12' },
  { key: 'maxHeartRate', label: 'Max HR', width: 'w-16' },
  { key: 'exerciseInducedAngina', label: 'Ex. Angina', width: 'w-24' },
  { key: 'stDepression', label: 'ST Dep.', width: 'w-16' },
  { key: 'slope', label: 'Slope', width: 'w-14' },
  { key: 'majorVessels', label: 'Vessels', width: 'w-16' },
  { key: 'thal', label: 'Thal.', width: 'w-28' },
  { key: 'diabetes', label: 'Diabetes', width: 'w-20' },
  { key: 'strokeHistory', label: 'Stroke Hx', width: 'w-20' },
  { key: 'heartDisease', label: 'Heart Dis.', width: 'w-20' },
];

function SortIcon({ col, sortKey, sortDir }: { col: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (col !== sortKey) return <ChevronsUpDown className="w-3 h-3 text-muted-foreground/50" />;
  return sortDir === 'asc'
    ? <ChevronUp className="w-3 h-3 text-teal-500" />
    : <ChevronDown className="w-3 h-3 text-teal-500" />;
}

function formatCell(key: SortKey, patient: Patient): string {
  const val = patient[key];
  if (key === 'gender') return patient.gender === Gender.male ? 'Male' : 'Female';
  if (key === 'race') return patient.race.charAt(0).toUpperCase() + patient.race.slice(1);
  if (key === 'chestPain') return CHEST_PAIN_LABELS[patient.chestPain];
  if (key === 'thal') return THAL_LABELS[patient.thal];
  if (typeof val === 'boolean') return val ? 'Yes' : 'No';
  if (typeof val === 'bigint') return val.toString();
  if (typeof val === 'number') return val.toFixed(1);
  return String(val);
}

function getBoolCellClass(key: SortKey, patient: Patient): string {
  if (key === 'heartDisease' && patient.heartDisease) return 'text-crimson-600 font-semibold';
  if (key === 'diabetes' && patient.diabetes) return 'text-amber-600';
  if (key === 'strokeHistory' && patient.strokeHistory) return 'text-amber-600';
  return '';
}

export default function PatientTable({ patients, sortKey, sortDir, onSort }: PatientTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            {COLUMNS.map(({ key, label, width }) => (
              <TableHead
                key={key}
                className={`${width ?? ''} cursor-pointer select-none hover:bg-muted transition-colors whitespace-nowrap text-xs font-semibold`}
                onClick={() => onSort(key)}
              >
                <div className="flex items-center gap-1">
                  {label}
                  <SortIcon col={key} sortKey={sortKey} sortDir={sortDir} />
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient, idx) => (
            <TableRow key={idx} className="hover:bg-muted/30 transition-colors">
              {COLUMNS.map(({ key }) => (
                <TableCell
                  key={key}
                  className={`text-xs py-2 whitespace-nowrap ${getBoolCellClass(key, patient)}`}
                >
                  {formatCell(key, patient)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

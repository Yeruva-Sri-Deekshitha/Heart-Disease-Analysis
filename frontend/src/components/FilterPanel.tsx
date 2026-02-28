import { type Dispatch, type SetStateAction } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RotateCcw, Filter } from 'lucide-react';
import { type FilterState, DEFAULT_FILTERS } from '@/hooks/useQueries';
import { Gender, Race } from '../backend';

interface FilterPanelProps {
  filters: FilterState;
  setFilters: Dispatch<SetStateAction<FilterState>>;
  ageMin?: number;
  ageMax?: number;
}

const GENDERS: { value: Gender; label: string }[] = [
  { value: Gender.male, label: 'Male' },
  { value: Gender.female, label: 'Female' },
];

const RACES: { value: Race; label: string }[] = [
  { value: Race.white, label: 'White' },
  { value: Race.black, label: 'Black' },
  { value: Race.asian, label: 'Asian' },
  { value: Race.latino, label: 'Latino' },
  { value: Race.other, label: 'Other' },
];

function countActiveFilters(filters: FilterState, defaults: FilterState): number {
  let count = 0;
  if (filters.ageRange[0] !== defaults.ageRange[0] || filters.ageRange[1] !== defaults.ageRange[1]) count++;
  if (filters.gender !== null) count++;
  if (filters.race !== null) count++;
  if (filters.diabetes !== null) count++;
  if (filters.strokeHistory !== null) count++;
  return count;
}

export default function FilterPanel({ filters, setFilters, ageMin = 30, ageMax = 69 }: FilterPanelProps) {
  const defaultsForRange: FilterState = { ...DEFAULT_FILTERS, ageRange: [ageMin, ageMax] };
  const activeCount = countActiveFilters(filters, defaultsForRange);

  const handleReset = () => {
    setFilters({ ...DEFAULT_FILTERS, ageRange: [ageMin, ageMax] });
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-card">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-teal-500" />
          <h3 className="font-display font-semibold text-sm text-foreground">Filters</h3>
          {activeCount > 0 && (
            <Badge className="bg-teal-500 text-white text-xs px-1.5 py-0 h-5">
              {activeCount}
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="text-xs text-muted-foreground hover:text-foreground h-7 px-2"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Reset
        </Button>
      </div>

      <div className="space-y-5">
        {/* Age Range */}
        <div>
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
            Age Range
          </Label>
          <div className="px-1">
            <Slider
              min={ageMin}
              max={ageMax}
              step={1}
              value={[filters.ageRange[0], filters.ageRange[1]]}
              onValueChange={([min, max]) =>
                setFilters((f) => ({ ...f, ageRange: [min, max] }))
              }
              className="w-full"
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-xs font-medium text-teal-600">{filters.ageRange[0]} yrs</span>
            <span className="text-xs font-medium text-teal-600">{filters.ageRange[1]} yrs</span>
          </div>
        </div>

        {/* Gender */}
        <div>
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
            Gender
          </Label>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilters((f) => ({ ...f, gender: null }))}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                filters.gender === null
                  ? 'bg-teal-500 text-white border-teal-500'
                  : 'bg-card text-muted-foreground border-border hover:border-teal-300'
              }`}
            >
              All
            </button>
            {GENDERS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() =>
                  setFilters((f) => ({ ...f, gender: f.gender === value ? null : value }))
                }
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  filters.gender === value
                    ? 'bg-teal-500 text-white border-teal-500'
                    : 'bg-card text-muted-foreground border-border hover:border-teal-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Race */}
        <div>
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
            Race / Ethnicity
          </Label>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilters((f) => ({ ...f, race: null }))}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                filters.race === null
                  ? 'bg-teal-500 text-white border-teal-500'
                  : 'bg-card text-muted-foreground border-border hover:border-teal-300'
              }`}
            >
              All
            </button>
            {RACES.map(({ value, label }) => (
              <button
                key={value}
                onClick={() =>
                  setFilters((f) => ({ ...f, race: f.race === value ? null : value }))
                }
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  filters.race === value
                    ? 'bg-teal-500 text-white border-teal-500'
                    : 'bg-card text-muted-foreground border-border hover:border-teal-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Diabetes Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-xs font-medium text-foreground">Diabetes</Label>
            <p className="text-xs text-muted-foreground">Filter by diabetes status</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilters((f) => ({ ...f, diabetes: null }))}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                filters.diabetes === null ? 'bg-teal-100 text-teal-700' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              All
            </button>
            <Switch
              checked={filters.diabetes === true}
              onCheckedChange={(checked) =>
                setFilters((f) => ({
                  ...f,
                  diabetes: f.diabetes === true && !checked ? null : checked ? true : false,
                }))
              }
              className="data-[state=checked]:bg-teal-500"
            />
            <span className="text-xs text-muted-foreground w-8">
              {filters.diabetes === null ? '—' : filters.diabetes ? 'Yes' : 'No'}
            </span>
          </div>
        </div>

        {/* Stroke History Toggle */}
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-xs font-medium text-foreground">Stroke History</Label>
            <p className="text-xs text-muted-foreground">Filter by stroke history</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilters((f) => ({ ...f, strokeHistory: null }))}
              className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                filters.strokeHistory === null ? 'bg-teal-100 text-teal-700' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              All
            </button>
            <Switch
              checked={filters.strokeHistory === true}
              onCheckedChange={(checked) =>
                setFilters((f) => ({
                  ...f,
                  strokeHistory: f.strokeHistory === true && !checked ? null : checked ? true : false,
                }))
              }
              className="data-[state=checked]:bg-teal-500"
            />
            <span className="text-xs text-muted-foreground w-8">
              {filters.strokeHistory === null ? '—' : filters.strokeHistory ? 'Yes' : 'No'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

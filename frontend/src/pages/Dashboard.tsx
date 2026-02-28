import { useState } from "react";
import { useFilteredPatients, useDatasetSize, DEFAULT_FILTERS, type FilterState } from "../hooks/useQueries";
import FilterPanel from "../components/FilterPanel";
import ChartCard from "../components/ChartCard";
import HeartDiseaseByAgeChart from "../components/charts/HeartDiseaseByAgeChart";
import HeartDiseaseByGenderChart from "../components/charts/HeartDiseaseByGenderChart";
import HeartDiseaseByRaceChart from "../components/charts/HeartDiseaseByRaceChart";
import ChestPainDistributionChart from "../components/charts/ChestPainDistributionChart";
import AgeVsHeartRateChart from "../components/charts/AgeVsHeartRateChart";
import CholesterolVsBPChart from "../components/charts/CholesterolVsBPChart";
import ComorbidityRatesChart from "../components/charts/ComorbidityRatesChart";
import CholesterolByAgeChart from "../components/charts/CholesterolByAgeChart";
import ThalassemiaDistributionChart from "../components/charts/ThalassemiaDistributionChart";
import AnginaByGenderChart from "../components/charts/AnginaByGenderChart";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Loader2 } from "lucide-react";

export default function Dashboard() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const { data: patients, isLoading, isError, error, refetch } = useFilteredPatients(filters);
  const { data: datasetSize } = useDatasetSize();

  const safePatients = patients ?? [];
  const heartDiseaseCount = safePatients.filter((p) => p.heartDisease).length;
  const avgAge =
    safePatients.length > 0
      ? Math.round(safePatients.reduce((sum, p) => sum + Number(p.age), 0) / safePatients.length)
      : 0;
  const avgCholesterol =
    safePatients.length > 0
      ? Math.round(safePatients.reduce((sum, p) => sum + Number(p.cholesterol), 0) / safePatients.length)
      : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-xl mx-4 mt-4 mb-6">
        <img
          src="/assets/generated/hero-banner.dim_1400x400.png"
          alt="Heart Disease Analysis"
          className="w-full object-cover h-48 md:h-64 rounded-xl"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent rounded-xl flex items-center px-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white font-sora">
              Heart Disease Analysis
            </h1>
            <p className="text-white/90 mt-2 text-sm md:text-base">
              Interactive dashboard exploring cardiovascular risk factors across{" "}
              {datasetSize ?? "..."} patient records
            </p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="px-4 mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-4 shadow-card border border-border">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Patients</p>
          {isLoading ? (
            <Skeleton className="h-8 w-16 mt-1" />
          ) : (
            <p className="text-2xl font-bold text-primary mt-1">{safePatients.length}</p>
          )}
        </div>
        <div className="bg-card rounded-xl p-4 shadow-card border border-border">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Heart Disease</p>
          {isLoading ? (
            <Skeleton className="h-8 w-16 mt-1" />
          ) : (
            <p className="text-2xl font-bold text-destructive mt-1">{heartDiseaseCount}</p>
          )}
        </div>
        <div className="bg-card rounded-xl p-4 shadow-card border border-border">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Avg Age</p>
          {isLoading ? (
            <Skeleton className="h-8 w-16 mt-1" />
          ) : (
            <p className="text-2xl font-bold text-foreground mt-1">{avgAge} yrs</p>
          )}
        </div>
        <div className="bg-card rounded-xl p-4 shadow-card border border-border">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Avg Cholesterol</p>
          {isLoading ? (
            <Skeleton className="h-8 w-16 mt-1" />
          ) : (
            <p className="text-2xl font-bold text-foreground mt-1">{avgCholesterol} mg/dL</p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 pb-8 flex flex-col lg:flex-row gap-6 items-start">
        {/* Filter Panel */}
        <div className="w-full lg:w-72 lg:sticky lg:top-20 shrink-0">
          <FilterPanel
            filters={filters}
            setFilters={setFilters}
            ageMin={30}
            ageMax={69}
          />
        </div>

        {/* Charts Grid */}
        <div className="flex-1 min-w-0">
          {isError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Failed to load patient data</AlertTitle>
              <AlertDescription className="flex items-center gap-3 mt-2">
                <span>{error instanceof Error ? error.message : "An unexpected error occurred."}</span>
                <Button size="sm" variant="outline" onClick={() => refetch()} className="shrink-0">
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {isLoading && (
            <div className="flex items-center justify-center gap-3 py-12 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="text-sm">Loading patient data…</span>
            </div>
          )}

          {!isLoading && !isError && safePatients.length === 0 && (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No patients match the current filters</AlertTitle>
              <AlertDescription>Try adjusting the filter criteria to see results.</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <ChartCard title="Heart Disease by Age Group" description="Prevalence rate per 10-year age bin">
              <HeartDiseaseByAgeChart patients={safePatients} />
            </ChartCard>

            <ChartCard title="Heart Disease by Gender" description="Comparative prevalence between male and female patients">
              <HeartDiseaseByGenderChart patients={safePatients} />
            </ChartCard>

            <ChartCard title="Heart Disease by Race / Ethnicity" description="Prevalence across racial and ethnic groups">
              <HeartDiseaseByRaceChart patients={safePatients} />
            </ChartCard>

            <ChartCard title="Chest Pain Distribution" description="Breakdown of chest pain types across all patients">
              <ChestPainDistributionChart patients={safePatients} />
            </ChartCard>

            <ChartCard title="Age vs. Max Heart Rate" description="Scatter plot comparing age and maximum heart rate by diagnosis">
              <AgeVsHeartRateChart patients={safePatients} />
            </ChartCard>

            <ChartCard title="Cholesterol vs. Resting Blood Pressure" description="Relationship between cholesterol and blood pressure">
              <CholesterolVsBPChart patients={safePatients} />
            </ChartCard>

            <ChartCard title="Comorbidity Rates" description="Diabetes and stroke history among heart disease patients">
              <ComorbidityRatesChart patients={safePatients} />
            </ChartCard>

            <ChartCard title="Average Cholesterol by Age Group" description="Mean cholesterol levels per 10-year age bin">
              <CholesterolByAgeChart patients={safePatients} />
            </ChartCard>

            <ChartCard title="Thalassemia Distribution" description="Distribution of thalassemia types across all patients">
              <ThalassemiaDistributionChart patients={safePatients} />
            </ChartCard>

            <ChartCard title="Exercise-Induced Angina by Gender" description="Angina rates compared between male and female patients">
              <AnginaByGenderChart patients={safePatients} />
            </ChartCard>
          </div>
        </div>
      </div>
    </div>
  );
}

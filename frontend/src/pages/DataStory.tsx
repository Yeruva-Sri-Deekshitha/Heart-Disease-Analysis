import { useState } from 'react';
import { useAllPatients } from '@/hooks/useQueries';
import StoryScene from '@/components/StoryScene';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import HeartDiseaseByAgeChart from '@/components/charts/HeartDiseaseByAgeChart';
import HeartDiseaseByGenderChart from '@/components/charts/HeartDiseaseByGenderChart';
import ChestPainDistributionChart from '@/components/charts/ChestPainDistributionChart';
import AgeVsHeartRateChart from '@/components/charts/AgeVsHeartRateChart';
import ComorbidityRatesChart from '@/components/charts/ComorbidityRatesChart';
import ThalassemiaDistributionChart from '@/components/charts/ThalassemiaDistributionChart';
import HeartDiseaseByRaceChart from '@/components/charts/HeartDiseaseByRaceChart';
import { type Patient } from '../backend';

interface Scene {
  title: string;
  description: string;
  chart: (patients: Patient[]) => React.ReactNode;
}

const SCENES: Scene[] = [
  {
    title: 'The Age Factor: Risk Rises with Every Decade',
    description:
      'Heart disease does not strike randomly — it follows a clear age gradient. Our dataset of 500 patients reveals that prevalence climbs steadily from the 30s through the 60s. Patients in their 60s face a dramatically higher risk than those in their 30s, underscoring why age is one of the strongest non-modifiable risk factors in cardiovascular medicine.',
    chart: (patients) => <HeartDiseaseByAgeChart patients={patients} />,
  },
  {
    title: 'Gender Disparities in Cardiovascular Risk',
    description:
      'Men and women experience heart disease differently. Historically, cardiovascular disease has been considered a "male" condition, but our data shows that while men do show higher prevalence rates, women are far from immune. Understanding these gender-based differences is critical for tailoring screening and prevention strategies.',
    chart: (patients) => <HeartDiseaseByGenderChart patients={patients} />,
  },
  {
    title: 'Race and Heart Disease: A Complex Relationship',
    description:
      'Cardiovascular risk is not distributed equally across racial and ethnic groups. Socioeconomic factors, access to healthcare, genetic predispositions, and lifestyle differences all contribute to varying prevalence rates. This chart highlights disparities that demand targeted public health interventions and equitable care delivery.',
    chart: (patients) => <HeartDiseaseByRaceChart patients={patients} />,
  },
  {
    title: 'Chest Pain: The Symptom That Speaks Volumes',
    description:
      'Chest pain is the hallmark symptom of cardiac events, but not all chest pain is created equal. Typical angina — the classic crushing chest pressure — is the most diagnostically significant, while asymptomatic presentations are alarmingly common. This distribution reveals why silent heart disease is such a dangerous phenomenon.',
    chart: (patients) => <ChestPainDistributionChart patients={patients} />,
  },
  {
    title: 'Heart Rate Under Stress: Age Tells the Story',
    description:
      'Maximum heart rate during exercise is a powerful diagnostic marker. As we age, our hearts lose the ability to accelerate as dramatically. This scatter plot reveals a clear downward trend in max heart rate with age — and crucially, patients with heart disease (shown in red) tend to cluster at lower heart rates for their age, suggesting reduced cardiac reserve.',
    chart: (patients) => <AgeVsHeartRateChart patients={patients} />,
  },
  {
    title: 'The Comorbidity Burden: Diabetes and Stroke',
    description:
      'Heart disease rarely travels alone. Among patients already diagnosed with cardiovascular disease, the rates of diabetes and prior stroke are strikingly elevated. These comorbidities create a vicious cycle — each condition worsens the others, increasing mortality risk and complicating treatment. Managing these conditions together is essential for improving outcomes.',
    chart: (patients) => <ComorbidityRatesChart patients={patients} />,
  },
  {
    title: 'Thalassemia: A Genetic Window into Cardiac Risk',
    description:
      'Thalassemia type — a measure of blood flow through the heart — provides a genetic lens on cardiovascular risk. Reversible defects, which indicate areas of the heart that receive insufficient blood during stress but recover at rest, are a hallmark of coronary artery disease. The distribution of thalassemia types in our dataset reflects the underlying spectrum of cardiac pathology.',
    chart: (patients) => <ThalassemiaDistributionChart patients={patients} />,
  },
];

export default function DataStory() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const { data: patients = [], isLoading } = useAllPatients();

  const currentScene = SCENES[sceneIndex];
  const totalScenes = SCENES.length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-display font-bold text-2xl text-foreground">Data Story</h1>
          <p className="text-sm text-muted-foreground">
            Seven key insights from the heart disease dataset
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex gap-1.5 mb-8">
        {SCENES.map((_, i) => (
          <button
            key={i}
            onClick={() => setSceneIndex(i)}
            className={`flex-1 h-1.5 rounded-full transition-colors ${
              i === sceneIndex
                ? 'bg-teal-500'
                : i < sceneIndex
                ? 'bg-teal-200'
                : 'bg-border'
            }`}
            aria-label={`Go to scene ${i + 1}`}
          />
        ))}
      </div>

      {/* Scene Content */}
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      ) : (
        <StoryScene
          key={sceneIndex}
          title={currentScene.title}
          description={currentScene.description}
          chart={currentScene.chart(patients)}
          sceneNumber={sceneIndex + 1}
          totalScenes={totalScenes}
        />
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
        <Button
          variant="outline"
          onClick={() => setSceneIndex((i) => Math.max(0, i - 1))}
          disabled={sceneIndex === 0}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        <div className="flex items-center gap-2">
          {SCENES.map((_, i) => (
            <button
              key={i}
              onClick={() => setSceneIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === sceneIndex ? 'bg-teal-500 w-4' : 'bg-border hover:bg-muted-foreground'
              }`}
              aria-label={`Scene ${i + 1}`}
            />
          ))}
        </div>

        <Button
          onClick={() => setSceneIndex((i) => Math.min(totalScenes - 1, i + 1))}
          disabled={sceneIndex === totalScenes - 1}
          className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

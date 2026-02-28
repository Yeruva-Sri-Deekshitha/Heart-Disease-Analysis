import { type ReactNode } from 'react';

interface StorySceneProps {
  title: string;
  description: string;
  chart: ReactNode;
  sceneNumber: number;
  totalScenes: number;
}

export default function StoryScene({ title, description, chart, sceneNumber, totalScenes }: StorySceneProps) {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-500 text-white text-sm font-bold font-display flex-shrink-0">
          {sceneNumber}
        </div>
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground font-medium">
          Scene {sceneNumber} of {totalScenes}
        </span>
      </div>

      <h2 className="text-2xl font-display font-bold text-foreground mb-3 leading-tight">
        {title}
      </h2>

      <p className="text-muted-foreground leading-relaxed mb-6 text-sm max-w-2xl">
        {description}
      </p>

      <div className="bg-card border border-border rounded-xl p-5 shadow-card">
        {chart}
      </div>
    </div>
  );
}

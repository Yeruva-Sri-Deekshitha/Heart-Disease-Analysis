import { type ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ChartCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export default function ChartCard({ title, description, children, className = '' }: ChartCardProps) {
  return (
    <Card className={`shadow-card hover:shadow-card-hover transition-shadow duration-200 ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-foreground font-display">{title}</CardTitle>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        {children}
      </CardContent>
    </Card>
  );
}

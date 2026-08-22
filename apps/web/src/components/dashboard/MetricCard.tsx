import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  iconColor?: string;
}

export function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  iconColor = 'text-primary bg-primary/10',
}: MetricCardProps) {
  return (
    <Card className="overflow-hidden relative group hover:border-primary/40 hover:shadow-md transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-700 dark:text-muted-foreground">{title}</p>
          <div className={cn('p-2.5 rounded-xl transition-transform group-hover:scale-110', iconColor)}>
            <Icon className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-foreground">{value}</span>
          {trend && (
            <span
              className={cn(
                'text-xs font-bold px-2.5 py-0.5 rounded-full border',
                trend.isPositive
                  ? 'bg-emerald-100 border-emerald-300 text-emerald-950 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-300'
                  : 'bg-rose-100 border-rose-300 text-rose-950 dark:bg-rose-950/60 dark:border-rose-800 dark:text-rose-300'
              )}
            >
              {trend.value}
            </span>
          )}
        </div>

        {description && (
          <p className="mt-1 text-xs text-slate-600 dark:text-muted-foreground font-medium">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

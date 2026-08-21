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
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className={cn('p-2.5 rounded-xl transition-transform group-hover:scale-110', iconColor)}>
            <Icon className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-foreground">{value}</span>
          {trend && (
            <span
              className={cn(
                'text-xs font-semibold px-2 py-0.5 rounded-full',
                trend.isPositive
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'
                  : 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400'
              )}
            >
              {trend.value}
            </span>
          )}
        </div>

        {description && (
          <p className="mt-1 text-xs text-muted-foreground font-normal">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

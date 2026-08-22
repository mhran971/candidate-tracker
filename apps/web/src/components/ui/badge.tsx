import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { ApplicationStatus, APPLICATION_STATUS_LABELS } from '@candidate-tracker/shared';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/90',
        secondary:
          'border-border bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/90',
        outline: 'border-border text-foreground',
        // High Contrast Application Status Badges
        applied:
          'border-slate-300 dark:border-slate-700 bg-slate-100 text-slate-800 font-semibold dark:bg-slate-800 dark:text-slate-200',
        screening:
          'border-amber-300 dark:border-amber-800 bg-amber-100/90 text-amber-900 font-semibold dark:bg-amber-950/60 dark:text-amber-300',
        interview:
          'border-blue-300 dark:border-blue-800 bg-blue-100/90 text-blue-950 font-semibold dark:bg-blue-950/60 dark:text-blue-300',
        offer:
          'border-purple-300 dark:border-purple-800 bg-purple-100/90 text-purple-950 font-semibold dark:bg-purple-950/60 dark:text-purple-300',
        hired:
          'border-emerald-300 dark:border-emerald-800 bg-emerald-100/90 text-emerald-950 font-semibold dark:bg-emerald-950/60 dark:text-emerald-300',
        rejected:
          'border-rose-300 dark:border-rose-800 bg-rose-100/90 text-rose-950 font-semibold dark:bg-rose-950/60 dark:text-rose-300',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export interface StatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge variant={status} className={cn('capitalize font-medium shadow-2xs', className)}>
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current opacity-85 inline-block" />
      {APPLICATION_STATUS_LABELS[status] || status}
    </Badge>
  );
}

export { Badge, badgeVariants };

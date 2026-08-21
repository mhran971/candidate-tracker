import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApplications, useUpdateApplication } from '@/hooks/useApplications';
import { useDebounce } from '@/hooks/useDebounce';
import {
  APPLICATION_STATUSES,
  APPLICATION_STATUS_LABELS,
  ApplicationStatus,
  ApplicationWithCandidate,
} from '@candidate-tracker/shared';
import { ApplicationFormModal } from '@/components/applications/ApplicationFormModal';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ErrorState } from '@/components/ui/error-state';
import { formatDate, formatCurrency } from '@/lib/formatters';
import {
  Search,
  Plus,
  Building,
  User,
  ArrowRight,
  ArrowLeft,
  Briefcase,
  Layers,
  Sparkles,
} from 'lucide-react';

const COLUMN_COLORS: Record<ApplicationStatus, { header: string; count: string; border: string }> = {
  applied: {
    header: 'bg-slate-100 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300',
    count: 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
    border: 'border-slate-200 dark:border-slate-800',
  },
  screening: {
    header: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300',
    count: 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300',
    border: 'border-amber-200/80 dark:border-amber-900/50',
  },
  interview: {
    header: 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300',
    count: 'bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300',
    border: 'border-blue-200/80 dark:border-blue-900/50',
  },
  offer: {
    header: 'bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300',
    count: 'bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300',
    border: 'border-purple-200/80 dark:border-purple-900/50',
  },
  hired: {
    header: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300',
    count: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300',
    border: 'border-emerald-200/80 dark:border-emerald-900/50',
  },
  rejected: {
    header: 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300',
    count: 'bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300',
    border: 'border-rose-200/80 dark:border-rose-900/50',
  },
};

export function KanbanPage() {
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 300);

  const { data, isLoading, isError, error, refetch } = useApplications({
    page: 1,
    limit: 100,
    search: debouncedSearch || undefined,
  });

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const updateMutation = useUpdateApplication();

  const handleMoveStage = async (app: ApplicationWithCandidate, direction: 'prev' | 'next') => {
    const currentIndex = APPLICATION_STATUSES.indexOf(app.status);
    let targetIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

    if (targetIndex < 0 || targetIndex >= APPLICATION_STATUSES.length) return;

    const newStatus = APPLICATION_STATUSES[targetIndex];
    if (!newStatus) return;

    await updateMutation.mutateAsync({
      id: app.id,
      payload: { status: newStatus },
    });
  };

  if (isError) {
    return (
      <ErrorState
        title="Failed to load Kanban Board"
        message={error?.message || 'Error fetching applications.'}
        onRetry={() => refetch()}
      />
    );
  }

  const applications = data?.data || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Pipeline Kanban</h2>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Bonus Feature
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Visual recruitment stage pipeline with stage transition shortcuts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Filter board..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9 h-9 text-xs bg-card"
            />
          </div>
          <Button onClick={() => setIsCreateOpen(true)} size="sm" className="gap-2 shadow-xs shrink-0">
            <Plus className="h-4 w-4" />
            New Application
          </Button>
        </div>
      </div>

      {/* Kanban Columns (Horizontal Scrollable Grid) */}
      <div className="flex gap-4 overflow-x-auto pb-6 pt-2 items-start min-h-[calc(100vh-240px)]">
        {APPLICATION_STATUSES.map((status, colIndex) => {
          const columnApps = applications.filter((app) => app.status === status);
          const style = COLUMN_COLORS[status];

          return (
            <div
              key={status}
              className="w-72 shrink-0 flex flex-col rounded-xl bg-card border border-border/80 shadow-xs max-h-[calc(100vh-230px)]"
            >
              {/* Column Header */}
              <div
                className={`p-3.5 rounded-t-xl border-b flex items-center justify-between font-semibold text-xs ${style.header} ${style.border}`}
              >
                <span className="capitalize flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-current" />
                  {APPLICATION_STATUS_LABELS[status]}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${style.count}`}>
                  {columnApps.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="p-3 flex-1 overflow-y-auto space-y-3">
                {isLoading ? (
                  <div className="space-y-3">
                    <div className="h-24 rounded-lg bg-muted/60 animate-pulse" />
                    <div className="h-24 rounded-lg bg-muted/60 animate-pulse" />
                  </div>
                ) : columnApps.length === 0 ? (
                  <div className="py-8 text-center text-xs text-muted-foreground border border-dashed border-border/60 rounded-lg">
                    No applications in this stage
                  </div>
                ) : (
                  columnApps.map((app) => (
                    <Card
                      key={app.id}
                      className="shadow-xs hover:shadow-md hover:border-primary/50 transition-all group bg-background relative overflow-hidden"
                    >
                      <CardContent className="p-3.5 space-y-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            to={`/applications/${app.id}`}
                            className="font-bold text-sm text-foreground hover:text-primary transition-colors line-clamp-1"
                          >
                            {app.jobTitle}
                          </Link>
                        </div>

                        <div className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                          <Building className="h-3.5 w-3.5 shrink-0 text-muted-foreground/80" />
                          <span className="truncate">{app.company}</span>
                        </div>

                        <div className="pt-1.5 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
                          <Link
                            to={`/candidates/${app.candidate.id}`}
                            className="flex items-center gap-1 hover:text-foreground font-medium truncate max-w-[130px]"
                            title={app.candidate.name}
                          >
                            <User className="h-3 w-3 text-primary shrink-0" />
                            <span className="truncate">{app.candidate.name}</span>
                          </Link>
                          <span>{formatDate(app.appliedAt, 'MMM dd')}</span>
                        </div>

                        {app.salaryExpectation && (
                          <div className="text-[11px] font-semibold text-foreground/80">
                            {formatCurrency(app.salaryExpectation)}
                          </div>
                        )}

                        {/* Stage Mover Buttons */}
                        <div className="pt-2 border-t border-border/40 flex items-center justify-between opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => handleMoveStage(app, 'prev')}
                            disabled={colIndex === 0}
                            className="p-1 rounded hover:bg-muted disabled:opacity-20 disabled:hover:bg-transparent text-xs text-muted-foreground hover:text-foreground cursor-pointer flex items-center gap-1"
                            title="Move to previous stage"
                          >
                            <ArrowLeft className="h-3 w-3" />
                            <span className="text-[10px]">Prev</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleMoveStage(app, 'next')}
                            disabled={colIndex === APPLICATION_STATUSES.length - 1}
                            className="p-1 rounded hover:bg-muted disabled:opacity-20 disabled:hover:bg-transparent text-xs text-primary font-medium hover:text-primary/80 cursor-pointer flex items-center gap-1"
                            title="Advance to next stage"
                          >
                            <span className="text-[10px]">Next</span>
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Modal */}
      <ApplicationFormModal
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />
    </div>
  );
}

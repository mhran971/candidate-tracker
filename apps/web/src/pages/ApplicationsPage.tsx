import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApplications, useDeleteApplication, useUpdateApplication } from '@/hooks/useApplications';
import { useDebounce } from '@/hooks/useDebounce';
import { ApplicationWithCandidate, APPLICATION_STATUSES, APPLICATION_STATUS_LABELS, ApplicationStatus } from '@candidate-tracker/shared';
import { ApplicationFormModal } from '@/components/applications/ApplicationFormModal';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { StatusBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { TableSkeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { formatDate, formatCurrency } from '@/lib/formatters';
import {
  Search,
  FilePlus,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  User,
  Building,
  Briefcase,
  Layers,
  X,
} from 'lucide-react';

export function ApplicationsPage() {
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const debouncedSearch = useDebounce(searchInput, 300);

  const { data, isLoading, isError, error, refetch } = useApplications({
    page,
    limit,
    search: debouncedSearch || undefined,
    status: (statusFilter as ApplicationStatus) || undefined,
    dateFrom: dateFrom ? new Date(dateFrom) : undefined,
    dateTo: dateTo ? new Date(dateTo) : undefined,
  });

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [appToEdit, setAppToEdit] = useState<ApplicationWithCandidate | null>(null);
  const [appToDelete, setAppToDelete] = useState<ApplicationWithCandidate | null>(null);

  const deleteMutation = useDeleteApplication();
  const updateMutation = useUpdateApplication();

  const handleDelete = async () => {
    if (!appToDelete) return;
    await deleteMutation.mutateAsync(appToDelete.id);
    setAppToDelete(null);
  };

  const handleQuickStatusChange = async (app: ApplicationWithCandidate, newStatus: ApplicationStatus) => {
    await updateMutation.mutateAsync({
      id: app.id,
      payload: { status: newStatus },
    });
  };

  const hasActiveFilters = Boolean(searchInput || statusFilter || dateFrom || dateTo);

  const clearFilters = () => {
    setSearchInput('');
    setStatusFilter('');
    setDateFrom('');
    setDateTo('');
    setPage(1);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Applications Tracker</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Cross-entity search across role, company, notes, and parent candidate fields.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="gap-2">
            <Link to="/applications/kanban">
              <Layers className="h-4 w-4" />
              Kanban View
            </Link>
          </Button>
          <Button onClick={() => setIsCreateOpen(true)} size="sm" className="gap-2 shadow-xs">
            <FilePlus className="h-4 w-4" />
            Add Application
          </Button>
        </div>
      </div>

      {/* Cross-Entity Search & Filter Bar */}
      <div className="bg-card p-4 rounded-xl border border-border/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Main Cross-Entity Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search across role, company, source OR candidate name, email, location..."
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setPage(1);
              }}
              className="pl-9 bg-background border-border/60"
            />
          </div>

          {/* Status Filter */}
          <div className="w-full md:w-48">
            <Select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="h-10 text-xs bg-background"
            >
              <option value="">All Statuses</option>
              {APPLICATION_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {APPLICATION_STATUS_LABELS[s]}
                </option>
              ))}
            </Select>
          </div>

          {/* Date Range: From */}
          <div className="w-full md:w-44">
            <DatePicker
              title="Applied Date From"
              placeholder="From date..."
              value={dateFrom}
              onChange={(val) => {
                setDateFrom(val);
                setPage(1);
              }}
              className="h-10 text-xs bg-background"
            />
          </div>

          {/* Date Range: To */}
          <div className="w-full md:w-44">
            <DatePicker
              title="Applied Date To"
              placeholder="To date..."
              value={dateTo}
              onChange={(val) => {
                setDateTo(val);
                setPage(1);
              }}
              className="h-10 text-xs bg-background"
            />
          </div>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 text-xs shrink-0">
              <X className="h-3.5 w-3.5" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Table & States */}
      {isLoading ? (
        <div className="bg-card p-6 rounded-xl border border-border/80 shadow-xs">
          <TableSkeleton rows={8} cols={6} />
        </div>
      ) : isError ? (
        <ErrorState
          title="Failed to load applications"
          message={error?.message || 'Error executing cross-entity query.'}
          onRetry={() => refetch()}
        />
      ) : data?.data.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title={hasActiveFilters ? 'No applications match your search' : 'No applications found'}
          description={
            hasActiveFilters
              ? 'Try relaxing your search terms or clearing status/date filters.'
              : 'Create your first candidate application to begin tracking the recruitment pipeline.'
          }
          actionLabel={hasActiveFilters ? 'Clear All Filters' : 'Create Application'}
          onAction={hasActiveFilters ? clearFilters : () => setIsCreateOpen(true)}
        />
      ) : (
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/70 text-slate-700 dark:text-slate-300 text-xs uppercase font-bold border-b border-border">
                <tr>
                  <th className="px-6 py-3.5">Job Role & Company</th>
                  <th className="px-6 py-3.5">Candidate</th>
                  <th className="px-6 py-3.5">Pipeline Status</th>
                  <th className="px-6 py-3.5">Salary Expectation</th>
                  <th className="px-6 py-3.5">Applied Date</th>
                  <th className="px-6 py-3.5">Source</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {data?.data.map((app) => (
                  <tr key={app.id} className="hover:bg-muted/30 transition-colors group">
                    {/* Role & Company */}
                    <td className="px-6 py-4">
                      <Link
                        to={`/applications/${app.id}`}
                        className="hover:text-primary transition-colors flex flex-col"
                      >
                        <span className="font-semibold text-foreground text-sm group-hover:underline">
                          {app.jobTitle}
                        </span>
                        <span className="text-xs text-muted-foreground font-medium flex items-center gap-1 mt-0.5">
                          <Building className="h-3 w-3 text-muted-foreground/80 shrink-0" />
                          {app.company}
                        </span>
                      </Link>
                    </td>

                    {/* Candidate Link (Bidirectional navigation) */}
                    <td className="px-6 py-4">
                      <Link
                        to={`/candidates/${app.candidate.id}`}
                        className="hover:text-primary transition-colors flex items-center gap-2 group/cand"
                        title={`View ${app.candidate.name}'s profile`}
                      >
                        <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs shrink-0">
                          <User className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex flex-col truncate max-w-[170px]">
                          <span className="font-semibold text-foreground text-xs group-hover/cand:underline truncate">
                            {app.candidate.name}
                          </span>
                          <span className="text-[11px] text-muted-foreground truncate">
                            {app.candidate.email}
                          </span>
                        </div>
                      </Link>
                    </td>

                    {/* Status Badge + Inline Quick Switcher */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <StatusBadge status={app.status} />
                        <select
                          value={app.status}
                          onChange={(e) =>
                            handleQuickStatusChange(app, e.target.value as ApplicationStatus)
                          }
                          className="text-[11px] bg-transparent text-muted-foreground hover:text-foreground border-none cursor-pointer focus:ring-0 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Change status"
                        >
                          {APPLICATION_STATUSES.map((st) => (
                            <option key={st} value={st}>
                              → {APPLICATION_STATUS_LABELS[st]}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>

                    {/* Salary */}
                    <td className="px-6 py-4 text-xs font-semibold text-muted-foreground">
                      {formatCurrency(app.salaryExpectation)}
                    </td>

                    {/* Applied Date */}
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      {formatDate(app.appliedAt)}
                    </td>

                    {/* Source */}
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      <span className="px-2 py-0.5 rounded bg-muted text-[11px] font-medium">
                        {app.source || 'Direct'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setAppToEdit(app)}
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          title="Edit Application"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setAppToDelete(app)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          title="Delete Application"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {data && data.meta.totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-3.5 border-t border-border/80 bg-muted/20 text-xs text-muted-foreground">
              <span>
                Showing {(page - 1) * limit + 1} to{' '}
                {Math.min(page * limit, data.meta.total)} of {data.meta.total} applications
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page <= 1}
                  className="h-8 gap-1"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Previous
                </Button>
                <span className="font-semibold px-2">
                  Page {page} of {data.meta.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(p + 1, data.meta.totalPages))}
                  disabled={page >= data.meta.totalPages}
                  className="h-8 gap-1"
                >
                  Next
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create / Edit Modal */}
      <ApplicationFormModal
        open={isCreateOpen || Boolean(appToEdit)}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false);
            setAppToEdit(null);
          }
        }}
        applicationToEdit={appToEdit}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        open={Boolean(appToDelete)}
        onOpenChange={(open) => {
          if (!open) setAppToDelete(null);
        }}
        title="Confirm Application Deletion"
        description={`Are you sure you want to delete the application for "${appToDelete?.jobTitle}" at "${appToDelete?.company}"?`}
        confirmLabel="Delete Application"
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}

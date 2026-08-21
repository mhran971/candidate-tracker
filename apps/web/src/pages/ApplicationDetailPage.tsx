import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApplication, useDeleteApplication, useUpdateApplication } from '@/hooks/useApplications';
import { ApplicationFormModal } from '@/components/applications/ApplicationFormModal';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/badge';
import { ErrorState } from '@/components/ui/error-state';
import { CardSkeleton } from '@/components/ui/skeleton';
import { formatDate, formatCurrency } from '@/lib/formatters';
import {
  APPLICATION_STATUSES,
  APPLICATION_STATUS_LABELS,
  ApplicationStatus,
} from '@candidate-tracker/shared';
import {
  ArrowLeft,
  User,
  Building,
  Calendar,
  DollarSign,
  Globe,
  Edit2,
  Trash2,
  Mail,
  MapPin,
  FileText,
  ExternalLink,
} from 'lucide-react';

export function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: application, isLoading, isError, error, refetch } = useApplication(id);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const deleteMutation = useDeleteApplication();
  const updateMutation = useUpdateApplication();

  const handleDelete = async () => {
    if (!id) return;
    await deleteMutation.mutateAsync(id);
    navigate('/applications');
  };

  const handleStatusUpdate = async (newStatus: ApplicationStatus) => {
    if (!id) return;
    await updateMutation.mutateAsync({
      id,
      payload: { status: newStatus },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-40 bg-muted rounded animate-pulse" />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (isError || !application) {
    return (
      <ErrorState
        title="Application Not Found"
        message={error?.message || 'The requested application does not exist or has been removed.'}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Bar with Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Button asChild variant="ghost" size="sm" className="gap-2 -ml-2 text-muted-foreground hover:text-foreground">
          <Link to="/applications">
            <ArrowLeft className="h-4 w-4" />
            Back to Applications
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsEditOpen(true)} className="gap-2">
            <Edit2 className="h-4 w-4" />
            Edit Application
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setIsDeleteOpen(true)}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Main Role & Company Card */}
      <Card className="shadow-xs overflow-hidden border-border/80">
        <div className="h-2.5 bg-gradient-to-r from-primary to-blue-600" />
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                  {application.jobTitle}
                </h1>
                <StatusBadge status={application.status} />
              </div>
              <div className="flex items-center gap-2 text-lg text-muted-foreground font-medium">
                <Building className="h-5 w-5 text-primary shrink-0" />
                <span>{application.company}</span>
              </div>
            </div>

            {/* Quick Status Stage Changer */}
            <div className="flex flex-col items-start md:items-end gap-1.5 bg-muted/40 p-3.5 rounded-xl border border-border/60">
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Update Pipeline Stage
              </label>
              <select
                value={application.status}
                onChange={(e) => handleStatusUpdate(e.target.value as ApplicationStatus)}
                className="text-xs font-semibold bg-background border border-border rounded-lg px-2.5 py-1.5 cursor-pointer focus:ring-1 focus:ring-primary"
              >
                {APPLICATION_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {APPLICATION_STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Key Facts Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border/60 text-xs">
            <div className="space-y-1">
              <span className="text-muted-foreground font-medium flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Applied Date
              </span>
              <p className="font-semibold text-foreground text-sm">
                {formatDate(application.appliedAt)}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-muted-foreground font-medium flex items-center gap-1">
                <DollarSign className="h-3.5 w-3.5" />
                Salary Expectation
              </span>
              <p className="font-semibold text-foreground text-sm">
                {formatCurrency(application.salaryExpectation)}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-muted-foreground font-medium flex items-center gap-1">
                <Globe className="h-3.5 w-3.5" />
                Application Source
              </span>
              <p className="font-semibold text-foreground text-sm">
                {application.source || 'Direct Portal'}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-muted-foreground font-medium flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Last Updated
              </span>
              <p className="font-semibold text-foreground text-sm">
                {formatDate(application.updatedAt)}
              </p>
            </div>
          </div>

          {/* Application Notes */}
          {application.notes && (
            <div className="pt-4 border-t border-border/60">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2">
                <FileText className="h-3.5 w-3.5" />
                Application Notes & Feedback
              </h3>
              <p className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed bg-muted/20 p-4 rounded-lg border border-border/40">
                {application.notes}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Parent Candidate Details (Required Bidirectional Navigation) */}
      <Card className="shadow-xs border-border/80">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shrink-0">
                <User className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-foreground">
                    {application.candidate.name}
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted font-medium text-muted-foreground">
                    Candidate Profile
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5 text-primary" />
                    {application.candidate.email}
                  </span>
                  {application.candidate.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-primary" />
                      {application.candidate.location}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <Button asChild variant="outline" size="sm" className="gap-2 shrink-0">
              <Link to={`/candidates/${application.candidate.id}`}>
                View Full Candidate Profile
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <ApplicationFormModal
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        applicationToEdit={application}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Confirm Application Deletion"
        description={`Are you sure you want to delete this application for "${application.jobTitle}" at "${application.company}"?`}
        confirmLabel="Delete Application"
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}

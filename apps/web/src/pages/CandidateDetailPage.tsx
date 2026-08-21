import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCandidate, useDeleteCandidate } from '@/hooks/useCandidates';
import { CandidateFormModal } from '@/components/candidates/CandidateFormModal';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/badge';
import { ErrorState } from '@/components/ui/error-state';
import { TableSkeleton } from '@/components/ui/skeleton';
import { formatDate, formatCurrency } from '@/lib/formatters';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ExternalLink,
  Edit2,
  Trash2,
  FilePlus,
  Briefcase,
  StickyNote,
  Building,
} from 'lucide-react';

export function CandidateDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: candidate, isLoading, isError, error, refetch } = useCandidate(id);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const deleteMutation = useDeleteCandidate();

  const handleDelete = async () => {
    if (!id) return;
    await deleteMutation.mutateAsync(id);
    navigate('/candidates');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-40 bg-muted rounded animate-pulse" />
        <div className="h-48 bg-muted/60 rounded-xl animate-pulse" />
        <TableSkeleton rows={4} cols={5} />
      </div>
    );
  }

  if (isError || !candidate) {
    return (
      <ErrorState
        title="Candidate Profile Not Found"
        message={error?.message || 'The requested candidate does not exist or has been deleted.'}
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Bar with Back Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Button asChild variant="ghost" size="sm" className="gap-2 -ml-2 text-muted-foreground hover:text-foreground">
          <Link to="/candidates">
            <ArrowLeft className="h-4 w-4" />
            Back to Candidates
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsEditOpen(true)} className="gap-2">
            <Edit2 className="h-4 w-4" />
            Edit Profile
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

      {/* Candidate Profile Overview Card */}
      <Card className="shadow-xs overflow-hidden border-border/80">
        <div className="h-2.5 bg-gradient-to-r from-primary/80 to-indigo-500" />
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-3">
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                {candidate.name}
              </h1>

              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary shrink-0" />
                  <a href={`mailto:${candidate.email}`} className="hover:underline text-foreground">
                    {candidate.email}
                  </a>
                </div>

                {candidate.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-primary shrink-0" />
                    <a href={`tel:${candidate.phone}`} className="hover:underline">
                      {candidate.phone}
                    </a>
                  </div>
                )}

                {candidate.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                    <span>{candidate.location}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary shrink-0" />
                  <span>Added {formatDate(candidate.createdAt)}</span>
                </div>
              </div>

              {candidate.linkedinUrl && (
                <div className="pt-1">
                  <a
                    href={candidate.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline bg-primary/10 px-3 py-1 rounded-md"
                  >
                    LinkedIn Profile
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>

            <div className="flex flex-col items-start md:items-end gap-2 bg-muted/40 p-4 rounded-xl border border-border/60 shrink-0">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Applications
              </span>
              <span className="text-3xl font-extrabold text-foreground">
                {candidate.applications?.length || 0}
              </span>
            </div>
          </div>

          {/* Notes Section */}
          {candidate.notes && (
            <div className="mt-6 pt-6 border-t border-border/60">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2">
                <StickyNote className="h-3.5 w-3.5" />
                Internal Recruiter Notes
              </h3>
              <p className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed bg-muted/20 p-3.5 rounded-lg border border-border/40">
                {candidate.notes}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Associated Applications Table */}
      <Card className="shadow-xs border-border/80">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Job Applications ({candidate.applications?.length || 0})
            </CardTitle>
          </div>
          <Button asChild size="sm" className="gap-2">
            <Link to="/applications">
              <FilePlus className="h-4 w-4" />
              New Application
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {!candidate.applications || candidate.applications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              No job applications linked to this candidate yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/40 text-muted-foreground text-xs uppercase font-medium border-y border-border/80">
                  <tr>
                    <th className="px-6 py-3.5">Job Role</th>
                    <th className="px-6 py-3.5">Company</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5">Salary Expectation</th>
                    <th className="px-6 py-3.5">Applied Date</th>
                    <th className="px-6 py-3.5">Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {candidate.applications.map((app) => (
                    <tr key={app.id} className="hover:bg-muted/30 transition-colors group">
                      <td className="px-6 py-4 font-semibold text-foreground">
                        <Link
                          to={`/applications/${app.id}`}
                          className="hover:text-primary group-hover:underline transition-colors"
                        >
                          {app.jobTitle}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground font-medium flex items-center gap-1.5">
                        <Building className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        {app.company}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="px-6 py-4 text-xs text-muted-foreground font-medium">
                        {formatCurrency(app.salaryExpectation)}
                      </td>
                      <td className="px-6 py-4 text-xs text-muted-foreground">
                        {formatDate(app.appliedAt)}
                      </td>
                      <td className="px-6 py-4 text-xs text-muted-foreground">
                        {app.source || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <CandidateFormModal
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        candidateToEdit={candidate}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Confirm Soft Delete"
        description={`Are you sure you want to delete "${candidate.name}"? Soft-deleted candidates will no longer appear in search.`}
        confirmLabel="Delete Candidate"
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}

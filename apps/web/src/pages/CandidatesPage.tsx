import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCandidates, useDeleteCandidate } from '@/hooks/useCandidates';
import { useDebounce } from '@/hooks/useDebounce';
import { CandidateListItem } from '@/api/candidates';
import { CandidateFormModal } from '@/components/candidates/CandidateFormModal';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TableSkeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { formatDate } from '@/lib/formatters';
import {
  Search,
  UserPlus,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  Users,
} from 'lucide-react';

export function CandidatesPage() {
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const debouncedSearch = useDebounce(searchInput, 300);

  const { data, isLoading, isError, error, refetch } = useCandidates({
    page,
    limit,
    search: debouncedSearch,
  });

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [candidateToEdit, setCandidateToEdit] = useState<CandidateListItem | null>(null);
  const [candidateToDelete, setCandidateToDelete] = useState<CandidateListItem | null>(null);

  const deleteMutation = useDeleteCandidate();

  const handleDelete = async () => {
    if (!candidateToDelete) return;
    await deleteMutation.mutateAsync(candidateToDelete.id);
    setCandidateToDelete(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Candidates Directory</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage candidates, view application histories, and search talent profiles.
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="gap-2 shrink-0 shadow-xs">
          <UserPlus className="h-4 w-4" />
          Add Candidate
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4 bg-card p-3 rounded-xl border border-border/80 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search candidates by name, email, location, or phone..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setPage(1);
            }}
            className="pl-9 bg-background border-border/60"
          />
        </div>
        {searchInput && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchInput('');
              setPage(1);
            }}
            className="text-xs"
          >
            Clear
          </Button>
        )}
      </div>

      {/* Table & States */}
      {isLoading ? (
        <div className="bg-card p-6 rounded-xl border border-border/80 shadow-xs">
          <TableSkeleton rows={8} cols={5} />
        </div>
      ) : isError ? (
        <ErrorState
          title="Failed to load candidates"
          message={error?.message || 'Error communicating with the database.'}
          onRetry={() => refetch()}
        />
      ) : data?.data.length === 0 ? (
        <EmptyState
          icon={Users}
          title={searchInput ? 'No matching candidates found' : 'No candidates registered yet'}
          description={
            searchInput
              ? `No candidates match "${searchInput}". Try adjusting your search query.`
              : 'Start by creating your first candidate profile in the recruitment tracker.'
          }
          actionLabel={searchInput ? 'Clear Search' : 'Add First Candidate'}
          onAction={
            searchInput
              ? () => {
                  setSearchInput('');
                  setPage(1);
                }
              : () => setIsCreateOpen(true)
          }
        />
      ) : (
        <div className="bg-card rounded-xl border border-border/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/40 text-muted-foreground text-xs uppercase font-medium border-b border-border/80">
                <tr>
                  <th className="px-6 py-3.5">Candidate</th>
                  <th className="px-6 py-3.5">Contact</th>
                  <th className="px-6 py-3.5">Location</th>
                  <th className="px-6 py-3.5 text-center">Applications</th>
                  <th className="px-6 py-3.5">Added Date</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {data?.data.map((candidate) => (
                  <tr
                    key={candidate.id}
                    className="hover:bg-muted/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <Link
                        to={`/candidates/${candidate.id}`}
                        className="font-semibold text-foreground hover:text-primary transition-colors flex flex-col"
                      >
                        <span className="text-sm group-hover:underline">{candidate.name}</span>
                        {candidate.linkedinUrl && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1 font-normal mt-0.5">
                            LinkedIn <ExternalLink className="h-3 w-3 inline" />
                          </span>
                        )}
                      </Link>
                    </td>
                    <td className="px-6 py-4 space-y-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5 text-foreground/80 font-medium">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="truncate max-w-[200px]">{candidate.email}</span>
                      </div>
                      {candidate.phone && (
                        <div className="flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <span>{candidate.phone}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      {candidate.location ? (
                        <span className="flex items-center gap-1 text-foreground/80 font-medium">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          {candidate.location}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                        <Briefcase className="h-3 w-3" />
                        {candidate._count?.applications || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      {formatDate(candidate.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setCandidateToEdit(candidate)}
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          title="Edit Candidate"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setCandidateToDelete(candidate)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          title="Delete Candidate (Soft Delete)"
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
                {Math.min(page * limit, data.meta.total)} of {data.meta.total} candidates
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
      <CandidateFormModal
        open={isCreateOpen || Boolean(candidateToEdit)}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false);
            setCandidateToEdit(null);
          }
        }}
        candidateToEdit={candidateToEdit}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        open={Boolean(candidateToDelete)}
        onOpenChange={(open) => {
          if (!open) setCandidateToDelete(null);
        }}
        title="Confirm Soft Delete"
        description={`Are you sure you want to delete candidate "${candidateToDelete?.name}"? Soft-deleted candidates will no longer appear in candidate searches or lists.`}
        confirmLabel="Delete Candidate"
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}

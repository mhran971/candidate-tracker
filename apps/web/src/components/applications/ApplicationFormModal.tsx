import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createApplicationSchema,
  CreateApplicationInput,
  ApplicationWithCandidate,
  APPLICATION_STATUSES,
  APPLICATION_STATUS_LABELS,
  ApplicationStatus,
} from '@candidate-tracker/shared';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { useCreateApplication, useUpdateApplication } from '@/hooks/useApplications';
import { useCandidates } from '@/hooks/useCandidates';
import { useDebounce } from '@/hooks/useDebounce';

interface ApplicationFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicationToEdit?: ApplicationWithCandidate | null;
  defaultCandidateId?: string;
}

export function ApplicationFormModal({
  open,
  onOpenChange,
  applicationToEdit,
  defaultCandidateId,
}: ApplicationFormModalProps) {
  const isEditing = Boolean(applicationToEdit);
  const createMutation = useCreateApplication();
  const updateMutation = useUpdateApplication();

  // Search candidate as-you-type in modal
  const [candidateSearch, setCandidateSearch] = useState('');
  const debouncedSearch = useDebounce(candidateSearch, 250);

  const { data: candidatesData, isLoading: isLoadingCandidates } = useCandidates({
    page: 1,
    limit: 50,
    search: debouncedSearch,
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateApplicationInput>({
    resolver: zodResolver(createApplicationSchema),
    defaultValues: {
      candidateId: defaultCandidateId || '',
      jobTitle: '',
      company: '',
      status: 'applied',
      appliedAt: new Date().toISOString().split('T')[0] as unknown as Date,
      salaryExpectation: null,
      source: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (applicationToEdit) {
      reset({
        candidateId: applicationToEdit.candidateId,
        jobTitle: applicationToEdit.jobTitle,
        company: applicationToEdit.company,
        status: applicationToEdit.status,
        appliedAt: new Date(applicationToEdit.appliedAt).toISOString().split('T')[0] as unknown as Date,
        salaryExpectation: applicationToEdit.salaryExpectation || null,
        source: applicationToEdit.source || '',
        notes: applicationToEdit.notes || '',
      });
    } else {
      reset({
        candidateId: defaultCandidateId || '',
        jobTitle: '',
        company: '',
        status: 'applied',
        appliedAt: new Date().toISOString().split('T')[0] as unknown as Date,
        salaryExpectation: null,
        source: '',
        notes: '',
      });
    }
  }, [applicationToEdit, defaultCandidateId, open, reset]);

  const onSubmit = async (values: CreateApplicationInput) => {
    // Format date string to valid date object
    const payload = {
      ...values,
      appliedAt: new Date(values.appliedAt),
      salaryExpectation: values.salaryExpectation ? Number(values.salaryExpectation) : null,
    };

    if (isEditing && applicationToEdit) {
      await updateMutation.mutateAsync({
        id: applicationToEdit.id,
        payload,
      });
    } else {
      await createMutation.mutateAsync(payload);
    }
    onOpenChange(false);
  };

  const isLoading = createMutation.isPending || updateMutation.isPending || isSubmitting;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Job Application' : 'Create Job Application'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Modify application status, company, or reassign candidate.'
              : 'Add a new job application linked to a registered candidate.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Candidate Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Candidate Selection *
            </label>
            <div className="space-y-2">
              <Input
                placeholder="Filter candidates dropdown by name..."
                value={candidateSearch}
                onChange={(e) => setCandidateSearch(e.target.value)}
                className="h-8 text-xs bg-muted/40"
              />
              <Select {...register('candidateId')} error={errors.candidateId?.message}>
                <option value="">
                  {isLoadingCandidates ? 'Loading candidates...' : '— Select a Candidate —'}
                </option>
                {candidatesData?.data.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.email})
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Job Title *
              </label>
              <Input
                placeholder="e.g. Senior Frontend Engineer"
                {...register('jobTitle')}
                error={errors.jobTitle?.message}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Company *
              </label>
              <Input
                placeholder="e.g. Stripe, Vercel"
                {...register('company')}
                error={errors.company?.message}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Pipeline Status *
              </label>
              <Select {...register('status')} error={errors.status?.message}>
                {APPLICATION_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {APPLICATION_STATUS_LABELS[s as ApplicationStatus]}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Applied Date *
              </label>
              <Controller
                control={control}
                name="appliedAt"
                render={({ field }) => (
                  <DatePicker
                    value={field.value}
                    onChange={(val) => field.onChange(val)}
                    error={errors.appliedAt?.message}
                  />
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Salary Expectation (USD)
              </label>
              <Input
                type="number"
                placeholder="e.g. 150000"
                {...register('salaryExpectation')}
                error={errors.salaryExpectation?.message}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Source
              </label>
              <Input
                placeholder="e.g. LinkedIn, Referral, Direct"
                {...register('source')}
                error={errors.source?.message}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Application Notes
            </label>
            <Textarea
              placeholder="Stage progress, feedback, interview schedule details..."
              rows={3}
              {...register('notes')}
              error={errors.notes?.message}
            />
          </div>

          <DialogFooter className="pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              {isEditing ? 'Save Changes' : 'Create Application'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

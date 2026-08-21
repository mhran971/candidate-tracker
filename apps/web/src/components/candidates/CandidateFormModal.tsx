import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createCandidateSchema,
  CreateCandidateInput,
  Candidate,
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
import { Textarea } from '@/components/ui/textarea';
import { useCreateCandidate, useUpdateCandidate } from '@/hooks/useCandidates';

interface CandidateFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidateToEdit?: Candidate | null;
}

export function CandidateFormModal({
  open,
  onOpenChange,
  candidateToEdit,
}: CandidateFormModalProps) {
  const isEditing = Boolean(candidateToEdit);
  const createMutation = useCreateCandidate();
  const updateMutation = useUpdateCandidate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateCandidateInput>({
    resolver: zodResolver(createCandidateSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      location: '',
      linkedinUrl: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (candidateToEdit) {
      reset({
        name: candidateToEdit.name,
        email: candidateToEdit.email,
        phone: candidateToEdit.phone || '',
        location: candidateToEdit.location || '',
        linkedinUrl: candidateToEdit.linkedinUrl || '',
        notes: candidateToEdit.notes || '',
      });
    } else {
      reset({
        name: '',
        email: '',
        phone: '',
        location: '',
        linkedinUrl: '',
        notes: '',
      });
    }
  }, [candidateToEdit, open, reset]);

  const onSubmit = async (values: CreateCandidateInput) => {
    if (isEditing && candidateToEdit) {
      await updateMutation.mutateAsync({
        id: candidateToEdit.id,
        payload: values,
      });
    } else {
      await createMutation.mutateAsync(values);
    }
    onOpenChange(false);
  };

  const isLoading = createMutation.isPending || updateMutation.isPending || isSubmitting;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Candidate Profile' : 'Add New Candidate'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update candidate contact information and recruiter notes.'
              : 'Enter candidate details to register them in the candidate directory.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Full Name *
              </label>
              <Input
                placeholder="e.g. Sarah Jenkins"
                {...register('name')}
                error={errors.name?.message}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Email Address *
              </label>
              <Input
                type="email"
                placeholder="e.g. sarah@example.com"
                {...register('email')}
                error={errors.email?.message}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Phone Number
              </label>
              <Input
                placeholder="+1 (555) 000-0000"
                {...register('phone')}
                error={errors.phone?.message}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Location
              </label>
              <Input
                placeholder="e.g. San Francisco, CA"
                {...register('location')}
                error={errors.location?.message}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              LinkedIn Profile URL
            </label>
            <Input
              placeholder="https://linkedin.com/in/username"
              {...register('linkedinUrl')}
              error={errors.linkedinUrl?.message}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Recruiter Notes
            </label>
            <Textarea
              placeholder="Background summary, technical domain strengths, references..."
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
              {isEditing ? 'Save Changes' : 'Create Candidate'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

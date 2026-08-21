import { z } from 'zod';
import {
  candidateSchema,
  createCandidateSchema,
  updateCandidateSchema,
  candidateParamsSchema,
  candidateQuerySchema,
} from '../schemas/candidate.schema.js';

export type Candidate = z.infer<typeof candidateSchema>;
export type CreateCandidateInput = z.infer<typeof createCandidateSchema>;
export type UpdateCandidateInput = z.infer<typeof updateCandidateSchema>;
export type CandidateParams = z.infer<typeof candidateParamsSchema>;
export type CandidateQuery = z.input<typeof candidateQuerySchema>;

export interface CandidateWithApplicationCount extends Candidate {
  _count?: {
    applications: number;
  };
  applicationCount?: number;
}

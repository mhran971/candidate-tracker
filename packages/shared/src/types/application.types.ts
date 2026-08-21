import { z } from 'zod';
import {
  applicationSchema,
  createApplicationSchema,
  updateApplicationSchema,
  applicationParamsSchema,
  applicationQuerySchema,
  applicationWithCandidateSchema,
} from '../schemas/application.schema.js';

export type Application = z.infer<typeof applicationSchema>;
export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>;
export type ApplicationParams = z.infer<typeof applicationParamsSchema>;
export type ApplicationQuery = z.input<typeof applicationQuerySchema>;
export type ApplicationWithCandidate = z.infer<typeof applicationWithCandidateSchema>;

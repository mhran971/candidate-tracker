import { z } from 'zod';
import { APPLICATION_STATUSES } from '../constants/status.js';
import { paginationQuerySchema } from './common.schema.js';
import { candidateSchema } from './candidate.schema.js';

export const applicationStatusSchema = z.enum(APPLICATION_STATUSES);

export const applicationSchema = z.object({
  id: z.string().uuid(),
  candidateId: z.string().uuid('Invalid candidate ID format'),
  jobTitle: z.string().min(1, 'Job title is required').max(150, 'Job title is too long').trim(),
  company: z.string().min(1, 'Company is required').max(150, 'Company is too long').trim(),
  status: applicationStatusSchema.default('applied'),
  appliedAt: z.coerce.date(),
  salaryExpectation: z.coerce
    .number()
    .int('Salary must be an integer')
    .positive('Salary must be positive')
    .nullable()
    .optional(),
  source: z.string().max(100).trim().nullable().optional(),
  notes: z.string().max(2000).trim().nullable().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const createApplicationSchema = applicationSchema
  .pick({
    candidateId: true,
    jobTitle: true,
    company: true,
    status: true,
    appliedAt: true,
    salaryExpectation: true,
    source: true,
    notes: true,
  })
  .partial({
    status: true,
    salaryExpectation: true,
    source: true,
    notes: true,
  });

export const updateApplicationSchema = createApplicationSchema.partial();

export const applicationParamsSchema = z.object({
  id: z.string().uuid('Invalid application ID format'),
});

export const applicationQuerySchema = paginationQuerySchema.extend({
  candidateId: z.string().uuid().optional(),
  status: applicationStatusSchema.optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
});

export const applicationWithCandidateSchema = applicationSchema.extend({
  candidate: candidateSchema.pick({
    id: true,
    name: true,
    email: true,
    phone: true,
    location: true,
  }),
});

import { z } from 'zod';
import { paginationQuerySchema } from './common.schema.js';

export const candidateSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long').trim(),
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  phone: z.string().max(50).trim().nullable().optional(),
  location: z.string().max(100).trim().nullable().optional(),
  linkedinUrl: z
    .string()
    .url('Invalid LinkedIn URL')
    .trim()
    .nullable()
    .optional()
    .or(z.literal('')),
  notes: z.string().max(2000).trim().nullable().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable().optional(),
});

export const createCandidateSchema = candidateSchema
  .pick({
    name: true,
    email: true,
    phone: true,
    location: true,
    linkedinUrl: true,
    notes: true,
  })
  .partial({
    phone: true,
    location: true,
    linkedinUrl: true,
    notes: true,
  });

export const updateCandidateSchema = createCandidateSchema.partial();

export const candidateParamsSchema = z.object({
  id: z.string().min(1, 'Invalid candidate ID format'),
});

export const candidateQuerySchema = paginationQuerySchema.extend({
  location: z.string().trim().optional(),
});

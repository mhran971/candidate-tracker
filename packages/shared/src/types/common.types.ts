import { z } from 'zod';
import {
  paginationQuerySchema,
  paginationMetaSchema,
  apiErrorResponseSchema,
} from '../schemas/common.schema.js';

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
export type PaginationMeta = z.infer<typeof paginationMetaSchema>;
export type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>;

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

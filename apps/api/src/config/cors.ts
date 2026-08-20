import { FastifyCorsOptions } from '@fastify/cors';
import { env } from './env.js';

export const corsConfig: FastifyCorsOptions = {
  origin: env.NODE_ENV === 'production' ? env.CORS_ORIGIN.split(',') : true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

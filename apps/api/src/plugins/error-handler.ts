import { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export function setupErrorHandler(fastify: FastifyInstance): void {
  fastify.setErrorHandler(
    (error: FastifyError | ZodError | Error, request: FastifyRequest, reply: FastifyReply) => {
      request.log.error(error);

      // Handle Zod validation errors
      if (error instanceof ZodError) {
        return reply.status(400).send({
          statusCode: 400,
          error: 'Bad Request',
          message: 'Validation failed',
          details: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
      }

      // Handle Fastify built-in schema validation errors
      if ('validation' in error && error.validation) {
        return reply.status(400).send({
          statusCode: 400,
          error: 'Bad Request',
          message: error.message,
          details: error.validation,
        });
      }

      // Handle Prisma known request errors
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2002: Unique constraint failed
        if (error.code === 'P2002') {
          const target = (error.meta?.target as string[])?.join(', ') || 'field';
          return reply.status(409).send({
            statusCode: 409,
            error: 'Conflict',
            message: `A record with this ${target} already exists`,
          });
        }

        // P2025: Record not found
        if (error.code === 'P2025') {
          return reply.status(404).send({
            statusCode: 404,
            error: 'Not Found',
            message: 'Requested record does not exist',
          });
        }

        // P2003: Foreign key constraint failed
        if (error.code === 'P2003') {
          return reply.status(400).send({
            statusCode: 400,
            error: 'Bad Request',
            message: 'Referenced foreign record does not exist',
          });
        }
      }

      // Handle standard HTTP status errors
      const statusCode = (error as FastifyError).statusCode || 500;
      const message = error.message || 'Internal Server Error';

      return reply.status(statusCode).send({
        statusCode,
        error: error.name || 'Error',
        message,
      });
    }
  );

  // Handle 404 Not Found
  fastify.setNotFoundHandler((request: FastifyRequest, reply: FastifyReply) => {
    reply.status(404).send({
      statusCode: 404,
      error: 'Not Found',
      message: `Route ${request.method}:${request.url} not found`,
    });
  });
}

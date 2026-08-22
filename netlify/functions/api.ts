import awsLambdaFastify from '@fastify/aws-lambda';
import { buildApp } from '../../apps/api/src/app.js';

const app = buildApp();
const proxy = awsLambdaFastify(app);

export const handler = async (event: any, context: any) => {
  // Prevent Lambda from hanging waiting for Prisma database connection pool to drain
  context.callbackWaitsForEmptyEventLoop = false;
  return proxy(event, context);
};

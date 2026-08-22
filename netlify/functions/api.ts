import awsLambdaFastify from '@fastify/aws-lambda';
import { buildApp } from '../../apps/api/src/app.js';

let app: any;
let proxy: any;

export const handler = async (event: any, context: any) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    if (!app) {
      app = buildApp();
      proxy = awsLambdaFastify(app);
    }
    return await proxy(event, context);
  } catch (err: any) {
    console.error('Netlify function error:', err);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        statusCode: 500,
        error: err.name || 'FunctionError',
        message: err.message,
        stack: err.stack,
      }),
    };
  }
};

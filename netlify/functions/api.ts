import awsLambdaFastify from '@fastify/aws-lambda';

const DEFAULT_DATABASE_URL =
  'postgresql://postgres.cxqvptwxenshwuxlbenw:mH671939200%25@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true';

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = DEFAULT_DATABASE_URL;
}

import { buildApp } from '../../apps/api/src/app.js';

let app: any;
let proxy: any;

export const handler = async (event: any, context: any) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    if (!process.env.DATABASE_URL) {
      process.env.DATABASE_URL = DEFAULT_DATABASE_URL;
    }
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

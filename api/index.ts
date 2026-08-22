import awsLambdaFastify from '@fastify/aws-lambda';

const DEFAULT_DATABASE_URL =
  'postgresql://postgres.cxqvptwxenshwuxlbenw:mH671939200%25@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true';

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = DEFAULT_DATABASE_URL;
}

import { buildApp } from './apps/api/src/app.js';

let app: any;
let proxy: any;

export default async function handler(req: any, res: any) {
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = DEFAULT_DATABASE_URL;
  }
  if (!app) {
    app = buildApp();
    proxy = awsLambdaFastify(app);
  }
  return proxy(req, res);
}

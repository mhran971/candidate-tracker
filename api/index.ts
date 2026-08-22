import awsLambdaFastify from '@fastify/aws-lambda';
import { buildApp } from './apps/api/src/app.js';

let app: any;
let proxy: any;

export default async function handler(req: any, res: any) {
  if (!app) {
    app = buildApp();
    proxy = awsLambdaFastify(app);
  }
  return proxy(req, res);
}

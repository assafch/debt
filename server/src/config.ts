import * as dotenv from 'dotenv';
dotenv.config();

function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`Missing required env var: ${name}`);
  return val;
}

function optional(name: string, fallback: string): string {
  return process.env[name] || fallback;
}

export const config = {
  PORT: parseInt(optional('PORT', '3000'), 10),
  CLIENT_ORIGIN: optional('CLIENT_ORIGIN', 'http://localhost:5173'),
  DATABASE_URL: requireEnv('DATABASE_URL'),
  JWT_SECRET: requireEnv('JWT_SECRET'),
  JWT_EXPIRY: optional('JWT_EXPIRY', '8h'),
  PRIORITY_API_KEY_PAT: requireEnv('PRIORITY_API_KEY_PAT'),
  PRIORITY_INVOICES_URL: requireEnv('PRIORITY_INVOICES_URL'),
  PRIORITY_CUSTOMERS_URL: requireEnv('PRIORITY_CUSTOMERS_URL'),
  SYNC_CRON_EXPRESSION: optional('SYNC_CRON_EXPRESSION', '0 */4 * * *'),
  NODE_ENV: optional('NODE_ENV', 'development'),
};

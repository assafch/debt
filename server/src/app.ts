import express from 'express';
import cors from 'cors';
import path from 'path';
import { config } from './config';
import { authMiddleware } from './middleware/auth';

import authRoutes from './routes/auth.routes';
import customersRoutes from './routes/customers.routes';
import invoicesRoutes from './routes/invoices.routes';
import syncRoutes from './routes/sync.routes';
import usersRoutes from './routes/users.routes';
import dashboardRoutes from './routes/dashboard.routes';

const app = express();

// In production the client is served from the same origin — CORS only needed in dev
app.use(
  cors({
    origin: config.NODE_ENV === 'production' ? false : config.CLIENT_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());

// Public routes
app.use('/api/auth', authRoutes);

// Routes (auth disabled for now)
app.use('/api/customers', customersRoutes);
app.use('/api/invoices', invoicesRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Serve React client in production
if (config.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientDist));
  // Catch-all: send index.html for client-side routing
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

export default app;

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

// Protected routes
app.use('/api/customers', authMiddleware, customersRoutes);
app.use('/api/invoices', authMiddleware, invoicesRoutes);
app.use('/api/sync', authMiddleware, syncRoutes);
app.use('/api/users', authMiddleware, usersRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);

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

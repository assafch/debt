import { Router, Request, Response } from 'express';
import { getDashboardStats } from '../services/dashboard.service';

const router = Router();

router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const stats = await getDashboardStats();
    res.json(stats);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch dashboard stats';
    res.status(500).json({ error: message });
  }
});

export default router;

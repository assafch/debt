import { Router, Request, Response } from 'express';
import { triggerSync } from '../priority/sync';
import { prisma } from '../lib/prisma';

const router = Router();

// Auth disabled for now — no requireAdmin check
router.post('/trigger', async (_req: Request, res: Response): Promise<void> => {
  try {
    const syncLogId = await triggerSync();
    res.json({ syncLogId });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to trigger sync';
    res.status(500).json({ error: message });
  }
});

router.get('/status', async (_req: Request, res: Response): Promise<void> => {
  try {
    const log = await prisma.syncLog.findFirst({
      orderBy: { startedAt: 'desc' },
    });
    res.json(log ?? { status: 'IDLE' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to get sync status';
    res.status(500).json({ error: message });
  }
});

export default router;

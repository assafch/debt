import { Router, Request, Response } from 'express';
import { login } from '../services/auth.service';

const router = Router();

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password required' });
    return;
  }
  try {
    const result = await login(email, password);
    res.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Login failed';
    res.status(401).json({ error: message });
  }
});

export default router;

import { Router, Request, Response } from 'express';
import { requireAdmin } from '../middleware/requireAdmin';
import { listUsers, createUser, updateUser } from '../services/users.service';
import { Role } from '@prisma/client';

const router = Router();

router.use(requireAdmin);

router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await listUsers();
    res.json(users);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch users';
    res.status(500).json({ error: message });
  }
});

router.post('/', async (req: Request, res: Response): Promise<void> => {
  const { email, fullName, role, password } = req.body;
  if (!email || !fullName || !role || !password) {
    res.status(400).json({ error: 'email, fullName, role, and password are required' });
    return;
  }
  if (!Object.values(Role).includes(role)) {
    res.status(400).json({ error: `Invalid role. Must be one of: ${Object.values(Role).join(', ')}` });
    return;
  }
  try {
    const user = await createUser({ email, fullName, role, password });
    res.status(201).json(user);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create user';
    res.status(400).json({ error: message });
  }
});

router.patch('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { fullName, role, isActive, password } = req.body;

  if (role && !Object.values(Role).includes(role)) {
    res.status(400).json({ error: `Invalid role` });
    return;
  }

  try {
    const user = await updateUser(id, { fullName, role, isActive, password });
    res.json(user);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update user';
    res.status(400).json({ error: message });
  }
});

export default router;

import { Router, Request, Response } from 'express';
import { listCustomers, getCustomerWithInvoices } from '../services/customers.service';

const router = Router();

router.get('/', async (req: Request, res: Response): Promise<void> => {
  const status = req.query.status ? String(req.query.status).split(',') : undefined;
  const aging = req.query.aging ? String(req.query.aging).split(',') : undefined;
  const search = req.query.search ? String(req.query.search) : undefined;
  const page = req.query.page ? parseInt(String(req.query.page), 10) : 1;
  const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : 50;

  try {
    const result = await listCustomers({ status, aging, search, page, limit });
    res.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch customers';
    res.status(500).json({ error: message });
  }
});

router.get('/:code', async (req: Request, res: Response): Promise<void> => {
  const { code } = req.params;
  try {
    const customer = await getCustomerWithInvoices(code);
    if (!customer) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }
    res.json(customer);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch customer';
    res.status(500).json({ error: message });
  }
});

export default router;

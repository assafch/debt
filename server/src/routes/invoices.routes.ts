import { Router, Request, Response } from 'express';
import { getInvoice, updateStatus } from '../services/invoices.service';
import { getNotes, addNote } from '../services/notes.service';

const router = Router();

router.get('/:invoiceNumber', async (req: Request, res: Response): Promise<void> => {
  const { invoiceNumber } = req.params;
  try {
    const invoice = await getInvoice(invoiceNumber);
    if (!invoice) {
      res.status(404).json({ error: 'Invoice not found' });
      return;
    }
    res.json({ ...invoice, amount: Number(invoice.amount) });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch invoice';
    res.status(500).json({ error: message });
  }
});

router.patch('/:invoiceNumber/status', async (req: Request, res: Response): Promise<void> => {
  const { invoiceNumber } = req.params;
  const { status } = req.body;
  if (!status) {
    res.status(400).json({ error: 'status is required' });
    return;
  }
  try {
    const invoice = await updateStatus(invoiceNumber, status);
    res.json({ ...invoice, amount: Number(invoice.amount) });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update status';
    res.status(400).json({ error: message });
  }
});

router.get('/:invoiceNumber/notes', async (req: Request, res: Response): Promise<void> => {
  const { invoiceNumber } = req.params;
  try {
    const notes = await getNotes(invoiceNumber);
    res.json(notes);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch notes';
    res.status(500).json({ error: message });
  }
});

router.post('/:invoiceNumber/notes', async (req: Request, res: Response): Promise<void> => {
  const { invoiceNumber } = req.params;
  const { content } = req.body;
  // Auth disabled for now — use a placeholder user id
  const authorId = req.user?.userId ?? 'system';
  if (!content) {
    res.status(400).json({ error: 'content is required' });
    return;
  }

  try {
    const note = await addNote(invoiceNumber, authorId, content);
    res.status(201).json(note);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to add note';
    res.status(400).json({ error: message });
  }
});

export default router;

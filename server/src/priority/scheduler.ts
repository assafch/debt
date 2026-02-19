import cron from 'node-cron';
import { config } from '../config';
import { triggerSync } from './sync';

export function startScheduler(): void {
  if (!cron.validate(config.SYNC_CRON_EXPRESSION)) {
    console.error(`Invalid cron expression: ${config.SYNC_CRON_EXPRESSION}`);
    return;
  }

  cron.schedule(config.SYNC_CRON_EXPRESSION, async () => {
    console.log('Auto-sync triggered by scheduler');
    try {
      const logId = await triggerSync();
      console.log(`Auto-sync started, logId: ${logId}`);
    } catch (err) {
      console.error('Auto-sync error:', err);
    }
  });

  console.log(`Scheduler started: ${config.SYNC_CRON_EXPRESSION}`);
}

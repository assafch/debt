import './config'; // Validates env vars on startup
import app from './app';
import { config } from './config';
import { startScheduler } from './priority/scheduler';

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
  startScheduler();
});

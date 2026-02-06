import { serve } from '@hono/node-server';
import app from './server.js';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 3000;

serve({
  fetch: app.fetch,
  port: PORT,
});

console.log(`Server działa na http://localhost:${PORT}`);

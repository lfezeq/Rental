import { Hono } from 'hono';
import { cors } from 'hono/cors';
import equipment from './endpoints/equipment.js';
import rentals from './endpoints/rentals.js';

const app = new Hono();

app.use('*', cors());
app.route('/equipment', equipment);
app.route('/rentals', rentals);

export default app;
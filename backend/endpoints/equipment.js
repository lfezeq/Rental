import { Hono } from "hono";
import db from '../db.js';

const app = new Hono();

app.get('/', (c) => {
    const equipment = db.prepare('SELECT * FROM equipment').all();
    return c.json(equipment);
});

export default app;
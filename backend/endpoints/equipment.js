import { Hono } from "hono";
import db from '../db.js';

const app = new Hono();

app.get('/', (c) => {
  const equipment = db.prepare('SELECT * FROM equipment').all();
  return c.json(equipment);
});

app.post('/', (c) => {
  return c.req.json().then(data => {
    const query = db.prepare(`INSERT INTO equipment (name, category, description, status, image_url)
      VALUES (?, ?, ?, ?, ?)`);
    const result = query.run(data.name, data.category, data.description, data.status || 'available', data.image_url || '');
    return c.json({ success: true, id: result.lastInsertRowid });
  });
});

app.put('/:id', (c) => {
  const id = c.req.param('id');
  return c.req.json().then(data => {
    const query = db.prepare(`UPDATE equipment
      SET name = ?, category = ?, description = ?, status = ?, image_url = ?
      WHERE id = ?`);
    const result = query.run(data.name, data.category, data.description, data.status, data.image_url, id);
    return c.json({ success: result.changes > 0 });
  });
});

app.delete('/:id', (c) => {
  const id = c.req.param('id');
  const query = db.prepare('DELETE FROM equipment WHERE id = ?');
  const result = query.run(id);
  return c.json({ success: result.changes > 0 });
});

app.get('/:id', (c) => {
  const id = c.req.param('id');
  const item = db.prepare('SELECT * FROM equipment WHERE id = ?').get(id);
  return c.json(item);
});

export default app;
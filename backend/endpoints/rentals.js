import { Hono } from "hono";
import db from "../db.js";

const app = new Hono();

app.get('/', (c) => {
    const query = db.prepare("SELECT * FROM rentals").all()
    return c.json(query)
});

app.post("/", (c) => {
  return c.req.json().then(data => {
    const query = db.prepare(`INSERT INTO rentals (equipment_id, user_id, rented_at, return_date, status)
      VALUES (?, ?, ?, ?, ?)`);
    const result = query.run(data.equipment_id, data.user_id, data.rented_at, data.return_date, "active");
    return c.json({ success: true, id: result.lastInsertRowid });
  });
});

app.put("/:id", (c) => {
  const id = c.req.param("id");
  const query = db.prepare(`UPDATE rentals SET returned_at = ?, status = ? WHERE id = ?`);
  const result = query.run(new Date().toISOString().split("T")[0], "completed", id);
  return c.json({ success: result.changes > 0 });
});

app.get('/:id', (c) => {
  const id = c.req.param('id');
  const rental = db.prepare('SELECT * FROM rentals WHERE id = ?').get(id);
  return c.json(rental);
});

app.get('/categories', (c) => {
  const categories = db.prepare('SELECT * FROM categories').all();
  return c.json(categories);
});

export default app;
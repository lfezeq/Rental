import { Hono } from "hono";
import db from "../db.js";
const app = new Hono();
app.get("/", (c) => {
  const category = c.req.query("category");
  const status = c.req.query("status");
  const search = c.req.query("search");
  let query = "SELECT * FROM equipment WHERE 1=1";
  const params = [];
  if (category) { query += " AND category = ?"; params.push(category); }
  if (status) { query += " AND status = ?"; params.push(status); }
  if (search) { query += " AND name LIKE ?"; params.push(`%${search}%`); }
  return c.json(db.prepare(query).all(...params));
});
app.post("/", async (c) => {
  const data = await c.req.json();
  const result = db.prepare(`
    INSERT INTO equipment (name, category, description, status, image_url)
    VALUES (?, ?, ?, ?, ?)
  `).run(data.name, data.category, data.description, data.status || "available", data.image_url || "");
  return c.json({ success: true, id: result.lastInsertRowid });
});
app.put("/:id", async (c) => {
  const id = c.req.param("id");
  const data = await c.req.json();
  const result = db.prepare(`
    UPDATE equipment
    SET name = ?, category = ?, description = ?, status = ?, image_url = ?
    WHERE id = ?
  `).run(data.name, data.category, data.description, data.status, data.image_url, id);
  return c.json({ success: result.changes > 0 });
});
app.delete("/:id", (c) => {
  const id = c.req.param("id");
  try {
    db.prepare("DELETE FROM rentals WHERE equipment_id = ?").run(id);
    const result = db.prepare("DELETE FROM equipment WHERE id = ?").run(id);
    return c.json({ success: result.changes > 0 });
  } catch (err) {
    return c.json({ success: false, error: err.message }, 500);
  }
});
export default app;

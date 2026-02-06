import { Hono } from "hono";
import db from "../db.js";
const app = new Hono();
app.get("/", (c) => c.json(db.prepare("SELECT * FROM rentals").all()));
app.post("/", async (c) => {
  const data = await c.req.json();
  const result = db.prepare(`
    INSERT INTO rentals (equipment_id, user_id, rented_at, return_date, status)
    VALUES (?, ?, ?, ?, ?)
  `).run(data.equipment_id, data.user_id, data.rented_at, data.return_date, "active");
  db.prepare("UPDATE equipment SET status = 'rented' WHERE id = ?").run(data.equipment_id);
  return c.json({ success: true, id: result.lastInsertRowid });
});
app.put("/:id", (c) => {
  const id = c.req.param("id");
  const rental = db.prepare("SELECT equipment_id FROM rentals WHERE id = ?").get(id);
  if (!rental) return c.json({ success: false, error: "Rental not found" });
  const result = db.prepare(`
    UPDATE rentals
    SET returned_at = ?, status = ?
    WHERE id = ?
  `).run(new Date().toISOString().split("T")[0], "completed", id);
  db.prepare("UPDATE equipment SET status = 'available' WHERE id = ?").run(rental.equipment_id);
  return c.json({ success: result.changes > 0 });
});
export default app;

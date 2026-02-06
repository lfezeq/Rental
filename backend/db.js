import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, "./database", process.env.DB_NAME || "database.db");
const db = new Database(dbPath);
db.pragma("foreign_keys = ON");
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
)
`);
db.exec(`
INSERT OR IGNORE INTO users (id, name, email, role)
VALUES (1, 'Admin', 'admin@example.com', 'admin')
`);
db.exec(`
CREATE TABLE IF NOT EXISTS equipment (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'available',
  image_url TEXT,
  created_at TEXT DEFAULT (datetime('now'))
)
`);
db.exec(`
INSERT OR IGNORE INTO equipment (id, name, category, description)
VALUES 
  (1, 'Laptop', 'Electronics', 'Gaming laptop'),
  (2, 'Mouse', 'Electronics', 'Wireless mouse'),
  (3, 'Projector', 'Projectors', 'HD projector'),
  (4, 'HDMI Cable', 'Accessories', 'High quality cable'),
  (5, 'Laptop Bag', 'Accessories', 'Protective bag')
`);
db.exec(`
CREATE TABLE IF NOT EXISTS rentals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  equipment_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  rented_at TEXT DEFAULT (datetime('now')),
  return_date TEXT,
  returned_at TEXT,
  status TEXT DEFAULT 'active',
  FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id)
)
`);
db.exec(`
INSERT OR IGNORE INTO rentals (id, equipment_id, user_id, rented_at, return_date, status)
VALUES
  (1, 1, 1, date('now'), date('now', '+7 days'), 'active')
`);
export default db;

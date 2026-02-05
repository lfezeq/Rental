import Database from "better-sqlite3";
import path from 'path';
import { fileURLToPath } from "url";
import dotenv from 'dotenv';
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, './database', process.env.DB_NAME);

const db = new Database(dbPath);

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
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT
)
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
CREATE TABLE IF NOT EXISTS rentals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  equipment_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  rented_at TEXT DEFAULT (datetime('now')),
  return_date TEXT,
  returned_at TEXT,
  status TEXT DEFAULT 'active',
  FOREIGN KEY (equipment_id) REFERENCES equipment(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
)
`);

export default db;
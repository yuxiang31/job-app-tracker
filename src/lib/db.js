import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dbDir = path.join(process.cwd(), "database"); // Create database directory if it doesn't exist

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, "job_tracker.db"); // Database file path

// Initialize database
const db =
  global.db ||
  new Database(dbPath);

db.pragma("foreign_keys = ON"); // Enable foreign key support
db.pragma("journal_mode = WAL");

if (process.env.NODE_ENV !== "production") {
  global.db = db;
}

export default db;
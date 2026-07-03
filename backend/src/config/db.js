import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../../data/app_orders.db');

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('agent','dg','garde','admin')),
    name TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS requests (
    id TEXT PRIMARY KEY,
    supplier_name TEXT NOT NULL,
    company TEXT NOT NULL,
    reason TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','validated','refused')),
    created_by TEXT NOT NULL,
    created_by_name TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    validated_by TEXT,
    validated_by_name TEXT,
    validated_at TEXT,
    refused_by TEXT,
    refused_by_name TEXT,
    refused_at TEXT,
    refusal_reason TEXT,
    FOREIGN KEY (created_by) REFERENCES users(id)
  );
`);

function seed() {
  const count = db.prepare('SELECT COUNT(*) as c FROM users').get().c;
  if (count > 0) return;

  const hash = bcrypt.hashSync('password', 10);
  const insert = db.prepare('INSERT INTO users (id, username, password, role, name) VALUES (?, ?, ?, ?, ?)');
  insert.run('1', 'agent1', hash, 'agent', 'Agent Ahmed');
  insert.run('2', 'dg1', hash, 'dg', 'Directeur Général');
  insert.run('3', 'garde1', hash, 'garde', 'Garde Salem');
  insert.run('4', 'admin1', hash, 'admin', 'Admin Admin');
}

seed();

export default db;

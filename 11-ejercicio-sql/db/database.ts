import Database from 'better-sqlite3';
import { fileURLToPath } from 'node:url';

const DB_PATH = fileURLToPath(new URL('../jobs.db', import.meta.url));

export const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');

db.pragma('foreign_keys = ON');

export default db;

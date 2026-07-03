import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import db from '../config/db.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', authorize('admin'), (req, res) => {
  const users = db.prepare('SELECT id, username, role, name, created_at FROM users').all();
  res.json(users);
});

router.post('/', authorize('admin'), (req, res) => {
  const { username, password, role, name } = req.body;
  if (!username || !password || !role || !name) {
    return res.status(400).json({ error: 'Tous les champs sont requis' });
  }
  if (!['agent', 'dg', 'garde', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Rôle invalide' });
  }
  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
  if (existing) {
    return res.status(400).json({ error: "Nom d'utilisateur déjà pris" });
  }
  const hashed = bcrypt.hashSync(password, 10);
  const id = randomUUID();
  db.prepare('INSERT INTO users (id, username, password, role, name) VALUES (?, ?, ?, ?, ?)')
    .run(id, username, hashed, role, name);
  res.status(201).json({ id, name, role, username });
});

export default router;

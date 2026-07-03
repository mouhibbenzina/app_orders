import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import db from '../config/db.js';

const router = Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Identifiant et mot de passe requis' });
  }
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user) {
    return res.status(401).json({ error: 'Identifiants invalides' });
  }
  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) {
    return res.status(401).json({ error: 'Identifiants invalides' });
  }
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
});

router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Non authentifié' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = db.prepare('SELECT id, name, role FROM users WHERE id = ?').get(decoded.id);
    if (!user) return res.status(401).json({ error: 'Utilisateur introuvable' });
    res.json(user);
  } catch {
    return res.status(401).json({ error: 'Token invalide' });
  }
});

router.post('/register', (req, res) => {
  const { username, password, name } = req.body;
  if (!username || !password || !name) {
    return res.status(400).json({ error: 'Nom d\'utilisateur, mot de passe et nom requis' });
  }
  if (username.length < 3) {
    return res.status(400).json({ error: 'Nom d\'utilisateur trop court (min 3 caractères)' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Mot de passe trop court (min 6 caractères)' });
  }
  const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
  if (existing) {
    return res.status(400).json({ error: 'Nom d\'utilisateur déjà pris' });
  }
  const id = randomUUID();
  const hashed = bcrypt.hashSync(password, 10);
  db.prepare('INSERT INTO users (id, username, password, role, name) VALUES (?, ?, ?, ?, ?)')
    .run(id, username, hashed, 'agent', name);
  const token = jwt.sign(
    { id, username, role: 'agent', name },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  res.status(201).json({ token, user: { id, name, role: 'agent' } });
});

export default router;

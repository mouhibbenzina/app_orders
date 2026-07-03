import { Router } from 'express';
import { randomUUID } from 'crypto';
import db from '../config/db.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', (req, res) => {
  const { status, date, search } = req.query;
  let sql = 'SELECT * FROM requests WHERE 1=1';
  const params = [];

  if (req.user.role === 'agent') {
    sql += ' AND created_by = ?';
    params.push(req.user.id);
  }
  if (req.user.role === 'garde') {
    sql += " AND status = 'validated'";
  }
  if (status) {
    sql += ' AND status = ?';
    params.push(status);
  }
  if (date) {
    sql += ' AND start_date <= ? AND end_date >= ?';
    params.push(date, date);
  }
  if (search) {
    sql += ' AND (LOWER(supplier_name) LIKE ? OR LOWER(company) LIKE ?)';
    params.push(`%${search.toLowerCase()}%`, `%${search.toLowerCase()}%`);
  }

  sql += ' ORDER BY created_at DESC';
  const requests = db.prepare(sql).all(...params);
  res.json(requests);
});

router.get('/:id', (req, res) => {
  const request = db.prepare('SELECT * FROM requests WHERE id = ?').get(req.params.id);
  if (!request) return res.status(404).json({ error: 'Demande introuvable' });
  res.json(request);
});

router.post('/', authorize('agent'), (req, res) => {
  const { supplierName, company, reason, startDate, endDate } = req.body;
  if (!supplierName || !company || !reason || !startDate || !endDate) {
    return res.status(400).json({ error: 'Tous les champs sont requis' });
  }
  const id = randomUUID();
  db.prepare(`
    INSERT INTO requests (id, supplier_name, company, reason, start_date, end_date, created_by, created_by_name)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, supplierName, company, reason, startDate, endDate, req.user.id, req.user.name);

  const request = db.prepare('SELECT * FROM requests WHERE id = ?').get(id);
  req.app.get('io').to('dg').emit('new-request', request);
  res.status(201).json(request);
});

router.patch('/:id/validate', authorize('dg'), (req, res) => {
  const request = db.prepare('SELECT * FROM requests WHERE id = ?').get(req.params.id);
  if (!request) return res.status(404).json({ error: 'Demande introuvable' });
  if (request.status !== 'pending') return res.status(400).json({ error: 'Demande déjà traitée' });

  db.prepare(`
    UPDATE requests SET status = 'validated', validated_by = ?, validated_by_name = ?, validated_at = datetime('now')
    WHERE id = ?
  `).run(req.user.id, req.user.name, req.params.id);

  const updated = db.prepare('SELECT * FROM requests WHERE id = ?').get(req.params.id);
  const io = req.app.get('io');
  io.to('garde').emit('request-updated', updated);
  io.to('agent').emit('request-updated', updated);
  res.json(updated);
});

router.patch('/:id/refuse', authorize('dg'), (req, res) => {
  const { reason } = req.body;
  const request = db.prepare('SELECT * FROM requests WHERE id = ?').get(req.params.id);
  if (!request) return res.status(404).json({ error: 'Demande introuvable' });
  if (request.status !== 'pending') return res.status(400).json({ error: 'Demande déjà traitée' });

  db.prepare(`
    UPDATE requests SET status = 'refused', refused_by = ?, refused_by_name = ?, refused_at = datetime('now'), refusal_reason = ?
    WHERE id = ?
  `).run(req.user.id, req.user.name, reason || null, req.params.id);

  const updated = db.prepare('SELECT * FROM requests WHERE id = ?').get(req.params.id);
  const io = req.app.get('io');
  io.to('garde').emit('request-updated', updated);
  io.to('agent').emit('request-updated', updated);
  res.json(updated);
});

export default router;

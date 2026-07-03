import bcrypt from 'bcryptjs';
import { users } from './config/db.js';

const seedPassword = bcrypt.hashSync('password', 10);
users.forEach((u) => (u.password = seedPassword));

console.log('Seed data prête');
console.log(
  users.map((u) => ({
    username: u.username,
    password: 'password',
    role: u.role,
    name: u.name,
  }))
);

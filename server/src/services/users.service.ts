import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
import { Role } from '@prisma/client';

export async function listUsers() {
  return prisma.user.findMany({
    select: { id: true, email: true, fullName: true, role: true, isActive: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createUser(data: {
  email: string;
  fullName: string;
  role: Role;
  password: string;
}) {
  const normalizedEmail = data.email.trim().toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) throw new Error('Email already in use');

  const passwordHash = await bcrypt.hash(data.password, 12);
  const user = await prisma.user.create({
    data: { email: normalizedEmail, fullName: data.fullName, role: data.role, passwordHash },
    select: { id: true, email: true, fullName: true, role: true, isActive: true, createdAt: true },
  });
  return user;
}

export async function updateUser(
  id: string,
  data: { fullName?: string; role?: Role; isActive?: boolean; password?: string }
) {
  const update: Record<string, unknown> = {};
  if (data.fullName !== undefined) update.fullName = data.fullName;
  if (data.role !== undefined) update.role = data.role;
  if (data.isActive !== undefined) update.isActive = data.isActive;
  if (data.password) update.passwordHash = await bcrypt.hash(data.password, 12);

  return prisma.user.update({
    where: { id },
    data: update,
    select: { id: true, email: true, fullName: true, role: true, isActive: true, createdAt: true },
  });
}

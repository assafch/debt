import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@company.com';
  const password = process.env.SEED_ADMIN_PASSWORD || 'Admin123!';
  const fullName = 'מנהל מערכת';

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin user already exists: ${email}`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      fullName,
      role: Role.ADMIN,
    },
  });

  console.log(`Created admin user: ${user.email}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.SEED_ADMIN_EMAIL || 'admin@company.com').trim().toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD || 'Admin123!';
  const fullName = 'מנהל מערכת';

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash, fullName, role: Role.ADMIN, isActive: true },
    create: { email, passwordHash, fullName, role: Role.ADMIN },
  });

  console.log(`Upserted admin user: ${user.email}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

import { PrismaClient } from '@prisma/client';
import { Hash } from "./utils/hash";

const prisma = new PrismaClient();

export async function adminSeeder() {
  const admin = await prisma.user.upsert({
    where: { email: 'admin@dev.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@dev.com',
      password: await Hash.password('asdqwe123'),
      role: 'admin',
    },
  });

  console.log(`✅ Admin user ensured: ${admin.email}`);
}
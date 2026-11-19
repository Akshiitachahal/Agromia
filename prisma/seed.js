const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = String(process.env.ADMIN_EMAIL || 'admin@agromia.com').trim().toLowerCase();
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    console.log(`Admin account already exists for ${email}; password unchanged.`);
    return;
  }

  const initialPassword = String(process.env.ADMIN_INITIAL_PASSWORD || '').trim();
  if (!initialPassword) {
    throw new Error('ADMIN_INITIAL_PASSWORD is required to create the initial admin account.');
  }

  await prisma.user.create({
    data: {
      email,
      passwordHash: await bcrypt.hash(initialPassword, 12),
      name: 'AGROMIA Admin',
      role: 'SUPER_ADMIN',
    },
  });

  console.log(`Initial admin account created for ${email}.`);
}

main()
  .catch((error) => {
    console.error('Unable to prepare the admin account.', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// prisma/seed.ts
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@example.com";
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (existing) {
    console.log("Admin already exists:", adminEmail);
    return;
  }
  const hashed = await bcrypt.hash("Admin@1234", 10); // غيّر الباسورد بعد النشر
  await prisma.user.create({
    data: {
      name: "الادمن الافتراضي",
      email: adminEmail,
      password: hashed,
      role: "ADMIN",
      isAdmin: true,
    },
  });
  console.log("Default admin created:", adminEmail);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

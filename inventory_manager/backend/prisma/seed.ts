import { PrismaClient, SystemRole } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const email = "admin";
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("Admin already exists");
  } else {
    const hashedPassword = await bcrypt.hash("admin", 10);
    const admin = await prisma.user.create({
      data: {
        email,
        name: "Admin",
        password: hashedPassword,
        role: SystemRole.ADMIN,
      },
    });
    console.log("Admin created:", admin);
  }

  const categories = ["Equipment", "Furniture", "Book", "Other"];
  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log("Categories seeded");

  const tags = [
    "Laptops",
    "Printers",
    "Phones",
    "Monitors",
    "Desks",
    "Chairs",
    "Books",
    "Projectors",
    "Scanners",
    "Cables",
  ];
  for (const name of tags) {
    await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log("Tags seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

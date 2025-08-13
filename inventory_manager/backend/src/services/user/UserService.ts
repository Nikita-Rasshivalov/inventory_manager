import { User } from "../../models/types.ts";
import { prisma } from "../../prisma/client.ts";
import { hashPassword } from "../../utils/hash.ts";

export class UserService {
  async create(name: string, email: string, password: string): Promise<User> {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new Error("Email already registered");

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });
    return new User(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    return user ? new User(user) : null;
  }

  async findById(id: number): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    return user ? new User(user) : null;
  }
}

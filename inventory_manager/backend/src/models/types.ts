import { comparePasswords } from "../utils/hash.ts";

export enum SystemRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export enum InventoryRole {
  OWNER = "OWNER",
  WRITER = "WRITER",
  READER = "READER",
}

export class User {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: SystemRole;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.role = data.role || SystemRole.USER;
  }

  async verifyPassword(password: string) {
    if (!this.password) return false;
    return comparePasswords(password, this.password);
  }
}

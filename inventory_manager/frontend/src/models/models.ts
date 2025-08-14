export enum SystemRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export class User {
  id: number;
  name: string;
  email: string;
  role: SystemRole;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.role = data.role || SystemRole.USER;
  }
}

export type AuthPayload = {
  userId: number;
  email: string;
  role: SystemRole;
};

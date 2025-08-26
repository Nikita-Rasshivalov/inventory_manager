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

export interface Inventory {
  id: number;
  title: string;
  ownerId: number;
  owner?: User;
  createdAt: string;
  updatedAt: string;
  members: InventoryMember[];
  fields: Field[];
  items: Item[];
}

export interface Item {
  id: number;
  inventoryId: number;
  createdById: number;
  customId?: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  createdBy?: User;
  fieldValues: ItemFieldValue[];
  comments: Comment[];
  likes: Like[];
}

export interface Field {
  id: number;
  inventoryId: number;
  name: string;
  type: string;
  order: number;
  showInTable: boolean;
}

export interface Comment {
  id: number;
  itemId: number;
  userId: number;
  content: string;
  createdAt: string;
  user?: User;
}

export interface Like {
  id: number;
  itemId: number;
  userId: number;
  createdAt: string;
  user?: User;
}

export interface InventoryMember {
  id: number;
  inventoryId: number;
  userId: number;
  role: InventoryRole;
  user?: User;
}

export type InventoryPayload = {
  title: string;
};

export interface ItemFieldValue {
  id?: number;
  fieldId: number;
  value: string | number | boolean | null;
}

export interface ItemPayload {
  customId?: string;
  customIdFormat?: CustomIdPart[];
  fieldValues?: ItemFieldValue[];
  version?: number;
}

export type CustomIdPart =
  | { type: "text"; value: string }
  | { type: "random"; bits?: 20 | 32; digits?: 6 | 9 }
  | { type: "guid" }
  | { type: "datetime"; format?: string }
  | { type: "sequence" };

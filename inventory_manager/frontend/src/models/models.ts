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

export interface Field {
  id: number;
  inventoryId: number;
  name: string;
  type: string;
  order: number;
  showInTable: boolean;
}

export interface ItemFieldValue {
  id: number;
  itemId: number;
  fieldId: number;
  value?: string;
  field?: Field;
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

export interface Item {
  id: number;
  inventoryId: number;
  createdById: number;
  customId?: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: User;
  fieldValues: ItemFieldValue[];
  comments: Comment[];
  likes: Like[];
}

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

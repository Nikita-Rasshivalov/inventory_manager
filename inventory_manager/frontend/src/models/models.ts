export enum SystemRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export enum InventoryRole {
  OWNER = "OWNER",
  WRITER = "WRITER",
  READER = "READER",
}

export enum InventoryFilter {
  Own = "own",
  Member = "member",
  Public = "public",
}

export class User {
  id: number;
  name: string;
  email: string;
  role: SystemRole;
  imageUrl: string;

  constructor(data: any) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.role = data.role || SystemRole.USER;
    this.imageUrl = data.imageUrl;
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
  customIdFormat?: string;
  comments: Comment[];
  version: number;
  isPublic: boolean;
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
  likes: Like[];
}

export interface Field {
  id: number;
  inventoryId: number;
  name: string;
  type: string;
}

export interface FieldPayload {
  name: string;
  type: string;
}

export interface ItemFieldValue {
  id?: number;
  fieldId: number;
  value: string | number | boolean | null;
  order: number;
  showInTable: boolean;
  name?: string;
  field?: Field;
}

export interface ItemPayload {
  customId?: string;
  fieldValues?: ItemFieldValue[];
  version?: number;
  order?: number;
  showInTable?: boolean;
}

export interface Comment {
  id: number;
  itemId: number;
  userId: number;
  content: string;
  createdAt: string;
  user?: User;
  inventory?: Inventory;
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
  members?: InventoryMember[];
  customIdFormat?: CustomIdPart[];
  version: number;
  isPublic?: boolean;
};

export interface TopInventory extends Inventory {
  _count: {
    items: number;
  };
}

export enum MemberAction {
  Add = "add",
  Update = "update",
  Remove = "remove",
}

export enum InventoryTabId {
  Own = "Own",
  Member = "Member",
  All = "All",
}

export type CustomIdPart =
  | { type: "text"; value: string }
  | { type: "random"; bits?: 20 | 32; digits?: 6 | 9 }
  | { type: "guid" }
  | { type: "datetime"; format?: string }
  | { type: "sequence" };

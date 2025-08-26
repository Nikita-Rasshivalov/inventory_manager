import { prisma } from "../prisma/client.ts";
import { v4 as uuidv4 } from "uuid";
import { format as formatDateFn } from "date-fns";
import { randomInt } from "crypto";

export type CustomIdPart =
  | { type: "text"; value: string }
  | { type: "random"; bits?: 20 | 32; digits?: 6 | 9 }
  | { type: "guid" }
  | { type: "datetime"; format?: string }
  | { type: "sequence" };

export async function generateCustomId(
  inventoryId: number,
  formatParts: CustomIdPart[]
): Promise<string> {
  const values: string[] = [];
  for (const part of formatParts) {
    switch (part.type) {
      case "text":
        values.push(part.value);
        break;
      case "random":
        if (part.bits) values.push(randomInt(0, 2 ** part.bits).toString());
        else if (part.digits) {
          const min = 10 ** (part.digits - 1);
          const max = 10 ** part.digits - 1;
          values.push(randomInt(min, max + 1).toString());
        }
        break;
      case "guid":
        values.push(uuidv4());
        break;
      case "datetime":
        values.push(formatDateFn(new Date(), part.format || "yyyyMMddHHmmss"));
        break;
      case "sequence":
        const count = await prisma.item.count({ where: { inventoryId } });
        values.push((count + 1).toString());
        break;
    }
  }
  return values.join("-");
}

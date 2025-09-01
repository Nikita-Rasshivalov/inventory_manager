import { fieldOptions } from "./fieldOptions";

interface ServerField {
  type: string;
  name: string;
  id?: number;
}

export const mapFieldToOption = (field: ServerField) => {
  const option = fieldOptions.find((opt) => opt.type === field.type);

  if (!option) return null;

  return {
    ...option,
    name: field.name,
    id: field.id,
  };
};

import { flexRender } from "@tanstack/react-table";
import { ItemFieldValue } from "../../../models/models";
import { ItemFieldCell } from "./ItemFieldCell";
export const renderCellContent = (
  cell: any,
  row: any,
  idx: number,
  props: {
    isEditing: boolean;
    isExpanded: boolean;
    fieldDrafts: Record<number, string>;
    setFieldDrafts: (drafts: Record<number, string>) => void;
    save: (row: any) => void;
    startEdit: (id: number) => void;
    page: number;
    limit: number;
  }
) => {
  switch (cell.column.id) {
    case "number":
      return (props.page - 1) * props.limit + idx + 1;

    case "customId":
      return <span>{cell.getValue()}</span>;

    default:
      if (cell.column.id.startsWith("fieldId_")) {
        const fieldId = Number(cell.column.id.split("_")[1]);
        const valueObj: ItemFieldValue | undefined =
          row.original.fieldValues.find(
            (f: ItemFieldValue) => f.fieldId === fieldId
          );
        const value = props.isEditing
          ? props.fieldDrafts[fieldId] ?? valueObj?.value
          : valueObj?.value ?? "";

        return (
          <ItemFieldCell
            value={value}
            isEditing={props.isEditing}
            onChange={(v: any) =>
              props.setFieldDrafts({ ...props.fieldDrafts, [fieldId]: v })
            }
          />
        );
      }

      return flexRender(cell.column.columnDef.cell, cell.getContext());
  }
};

import { flexRender } from "@tanstack/react-table";
import { TitleCell } from "./TitleCell";

export const renderCellContent = (
  cell: any,
  row: any,
  idx: number,
  props: {
    isEditing: boolean;
    isExpanded: boolean;
    titleDraft: string;
    setTitleDraft: (v: string) => void;
    save: (row: any) => void;
    startEdit: (id: number, current: string) => void;
    page: number;
    limit: number;
  }
) => {
  switch (cell.column.id) {
    case "number":
      return (props.page - 1) * props.limit + idx + 1;
    case "title":
      return (
        <TitleCell
          isEditing={props.isEditing}
          isExpanded={props.isExpanded}
          titleDraft={props.titleDraft}
          setTitleDraft={props.setTitleDraft}
          save={props.save}
          startEdit={props.startEdit}
          row={row}
        />
      );
    default:
      return flexRender(cell.column.columnDef.cell, cell.getContext());
  }
};

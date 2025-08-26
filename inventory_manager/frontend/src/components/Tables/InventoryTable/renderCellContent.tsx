import { flexRender } from "@tanstack/react-table";

export const renderCellContent = (
  cell: any,
  row: any,
  idx: number,
  props: {
    page: number;
    limit: number;
  }
) => {
  switch (cell.column.id) {
    case "number":
      return (props.page - 1) * props.limit + idx + 1;
    case "title":
      return <span>{row.original.title}</span>;
    default:
      return flexRender(cell.column.columnDef.cell, cell.getContext());
  }
};

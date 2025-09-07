import { flexRender } from "@tanstack/react-table";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

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

    case "description":
      return row.original.description ? (
        <Markdown remarkPlugins={[remarkGfm]}>
          {row.original.description}
        </Markdown>
      ) : (
        "—"
      );

    case "tags": {
      const tags = row.original.tags;
      return tags?.length ? (
        <div className="space-y-1">
          {tags.map((t: any) => (
            <div key={t.id}>{t.name}</div>
          ))}
        </div>
      ) : (
        "—"
      );
    }

    default:
      return flexRender(cell.column.columnDef.cell, cell.getContext());
  }
};

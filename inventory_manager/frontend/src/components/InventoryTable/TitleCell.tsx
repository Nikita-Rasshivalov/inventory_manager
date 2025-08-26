import { Pencil } from "lucide-react";

export const TitleCell = ({
  isEditing,
  isExpanded,
  titleDraft,
  setTitleDraft,
  save,
  startEdit,
  row,
}: any) => {
  if (isEditing) {
    return (
      <input
        className="border rounded px-2 py-1 flex-1"
        value={titleDraft}
        onChange={(e) => setTitleDraft(e.target.value)}
        onBlur={() => save(row)}
        onKeyDown={(e) => e.key === "Enter" && save(row)}
        autoFocus
        onClick={(e) => e.stopPropagation()}
      />
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span>{row.original.title}</span>
      {isExpanded && (
        <Pencil
          size={16}
          className="text-gray-400 hover:text-gray-600"
          onClick={(e) => {
            e.stopPropagation();
            startEdit(row.id, row.original.title);
          }}
        />
      )}
    </div>
  );
};

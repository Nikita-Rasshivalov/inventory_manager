import Button from "../Button";

const separator: string = "...";

export const PageItem = ({
  p,
  page,
  onPageChange,
}: {
  p: number | string;
  page: number;
  onPageChange: (p: number) => void;
}) => {
  if (p === separator) return <span className="px-3 py-1">{p}</span>;

  return (
    <Button
      onClick={() => onPageChange(p as number)}
      className={`px-3 py-1 rounded ${
        p === page ? "bg-gray-500 text-white" : "bg-gray-200"
      }`}
    >
      {p}
    </Button>
  );
};

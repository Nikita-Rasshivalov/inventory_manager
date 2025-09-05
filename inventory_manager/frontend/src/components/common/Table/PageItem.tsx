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
  if (p === separator)
    return (
      <span className="px-3 py-1 text-gray-700 dark:text-gray-300">{p}</span>
    );

  return (
    <Button
      onClick={() => onPageChange(p as number)}
      className={`px-3 py-1 rounded transition-colors duration-200
        ${
          p === page
            ? "bg-blue-600 text-white dark:bg-blue-500 dark:text-gray-100"
            : "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 "
        }`}
    >
      {p}
    </Button>
  );
};

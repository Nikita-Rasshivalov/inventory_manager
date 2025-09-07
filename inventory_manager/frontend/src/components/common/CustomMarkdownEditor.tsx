import { useRef } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const CustomMarkdownEditor = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const wrapSelection = (before: string, after: string = before) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.slice(start, end);

    const newText = selected.length
      ? value.slice(0, start) + before + selected + after + value.slice(end)
      : value.slice(0, start) + before + after + value.slice(end);

    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      if (selected.length) {
        textarea.selectionStart = start + before.length;
        textarea.selectionEnd = end + before.length;
      } else {
        textarea.selectionStart = textarea.selectionEnd = start + before.length;
      }
    }, 0);
  };

  const buttonClass =
    "px-3 py-1 font-bold border rounded hover:bg-blue-500 hover:text-white transition-colors";

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <button
          type="button"
          className={buttonClass}
          onClick={() => wrapSelection("**")}
        >
          B
        </button>
        <button
          type="button"
          className={buttonClass}
          onClick={() => wrapSelection("*")}
        >
          I
        </button>
        <button
          type="button"
          className={buttonClass}
          onClick={() => wrapSelection("***")}
        >
          BI
        </button>
        <button
          type="button"
          className={buttonClass}
          onClick={() => wrapSelection("~~")}
        >
          S
        </button>
      </div>

      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-40 border p-2 rounded resize-none focus:ring-2 focus:ring-blue-400 focus:outline-none"
        placeholder="..."
      />

      {value && (
        <div className="mt-4 p-2 border rounded bg-gray-50 dark:bg-gray-800 overflow-auto">
          <Markdown remarkPlugins={[remarkGfm]}>{value}</Markdown>
        </div>
      )}
    </div>
  );
};

export default CustomMarkdownEditor;

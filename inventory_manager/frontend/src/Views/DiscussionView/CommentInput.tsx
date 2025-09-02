import { ArrowRight } from "lucide-react";
import Button from "../../components/common/Button";
import { useRef, useEffect, useState } from "react";

interface CommentInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
}

const CommentInput = ({ value, onChange, onSend }: CommentInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [height, setHeight] = useState(40);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "0px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight + "px";
      setHeight(scrollHeight);
    }
  }, [value]);

  return (
    <div className="mt-4 w-full flex space-x-2">
      <textarea
        ref={textareaRef}
        rows={1}
        style={{ height }}
        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:outline-none bg-white text-gray-900 placeholder-gray-400 resize-none overflow-hidden"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
      />
      <Button
        onClick={onSend}
        className="flex-shrink-0 h-10 rounded-lg bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center"
      >
        <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default CommentInput;

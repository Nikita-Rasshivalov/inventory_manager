import { elementOptions } from "./elementOptions";

interface ServerItem {
  type: string;
  value?: string;
  bits?: number;
  digits?: number;
}
export const elementMapper = (item: ServerItem) => {
  const mapped = elementOptions.find((opt) => {
    switch (item.type) {
      case "text":
        return opt.type === "fixedText";

      case "random":
        if (item.digits === 6) return opt.type === "random6";
        if (item.digits === 9) return opt.type === "random9";
        if (item.bits === 20) return opt.type === "random20";
        if (item.bits === 32) return opt.type === "random32";
        return false;

      case "guid":
        return opt.type === "guid";

      case "datetime":
        return opt.type === "datetime";

      case "sequence":
        return opt.type === "sequence";

      default:
        return false;
    }
  });

  if (mapped && item.type === "text") {
    return { ...mapped, value: item.value || "" };
  }

  return mapped;
};

import { format as formatDateFn } from "date-fns";
import { v4 as uuidv4 } from "uuid";

export const generateRandom32 = () => {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return array[0].toString(16);
};

export const generateRandom20 = () => {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return (array[0] & 0xfffff).toString(16);
};

export const generateRandom6 = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const generateRandom9 = () => {
  return Math.floor(100000000 + Math.random() * 900000000).toString();
};

export const generateTemplate = (idElements: any) => {
  return idElements.map((el: any) => {
    switch (el.type) {
      case "fixedText":
        return { type: "text", value: el.value || "STATIC" };
      case "random32":
        return { type: "random", bits: 32 };
      case "random20":
        return { type: "random", bits: 20 };
      case "random6":
        return { type: "random", digits: 6 };
      case "random9":
        return { type: "random", digits: 9 };
      case "guid":
        return { type: "guid" };
      case "datetime":
        return { type: "datetime", format: "yyyyMMddHHmmss" };
      case "sequence":
        return { type: "sequence" };
      default:
        return { type: "text", value: "" };
    }
  });
};

export function generatePartExample(el: any, elementsLength: number): string {
  switch (el.type) {
    case "fixedText":
      return el.value;
    case "random32":
      return generateRandom32();
    case "random20":
      return generateRandom20();
    case "random6":
      return generateRandom6();
    case "random9":
      return generateRandom9();
    case "guid":
      return uuidv4();
    case "datetime":
      return formatDateFn(new Date(), "yyyyMMddHHmmss");
    case "sequence":
      return String(1 + elementsLength);
    default:
      return "";
  }
}

export function generateLiveExample(elements: any[]): string {
  return elements
    .map((el) => generatePartExample(el, elements.length))
    .join("-");
}

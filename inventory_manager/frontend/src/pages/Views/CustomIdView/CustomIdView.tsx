import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { format as formatDateFn } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import IdElement from "./IdElement";
import {
  generateRandom32,
  generateRandom20,
  generateRandom6,
  generateRandom9,
} from "./randomGenerators";
import SelectWithTooltip from "./SelectWithTooltip";
import Button from "../../../components/common/Button";
import { elementOptions } from "./elementOptions";

const CustomIdView = () => {
  const [idElements, setIdElements] = useState<any[]>([]);
  const [liveExample, setLiveExample] = useState<string>("");
  const [newElementType, setNewElementType] = useState<string>("");

  const handleDragEnd = (result: any) => {
    const { source, destination } = result;

    if (!destination) return;

    const reorderedItems = Array.from(idElements);
    const [removed] = reorderedItems.splice(source.index, 1);
    reorderedItems.splice(destination.index, 0, removed);

    setIdElements(reorderedItems);
    generateLiveExample(reorderedItems);
  };

  const generateLiveExample = (elements: any[]) => {
    const example = elements
      .map((el) => {
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
            return 1 + elements.length;
          default:
            return "";
        }
      })
      .join("-");

    setLiveExample(example);
  };

  const handleAddElement = () => {
    if (!newElementType) return;

    const newElement = {
      type: newElementType,
      value: "",
      label:
        elementOptions.find((opt) => opt.value === newElementType)?.label || "",
      tooltip:
        elementOptions.find((opt) => opt.value === newElementType)?.tooltip ||
        "",
    };
    const updatedElements = [...idElements, newElement];
    setIdElements(updatedElements);
    generateLiveExample(updatedElements);
  };

  const handleRemoveElement = (index: number) => {
    const updatedElements = idElements.filter((_, i) => i !== index);
    setIdElements(updatedElements);
    generateLiveExample(updatedElements);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Customize ID Format</h2>

      <div className="p-4 rounded-md bg-gray-50">
        <h3 className="text-lg font-medium">Live Example:</h3>
        <div className="text-xl text-gray-700">{liveExample}</div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div
              className="space-y-4"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {idElements.map((item, index) => (
                <Draggable
                  key={item.label}
                  draggableId={item.label}
                  index={index}
                >
                  {(provided) => (
                    <IdElement
                      item={item}
                      provided={provided}
                      onRemove={() => handleRemoveElement(index)}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div className="flex items-center space-x-4">
        <SelectWithTooltip
          value={newElementType}
          onChange={(e) => setNewElementType(e.target.value)}
          options={elementOptions}
        />
        <Button onClick={handleAddElement} className="w-30 h-6 text-sm ">
          Add
        </Button>
      </div>
    </div>
  );
};

export default CustomIdView;

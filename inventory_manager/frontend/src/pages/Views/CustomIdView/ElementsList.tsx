import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Element from "./Element";
import { generateLiveExample } from "../../../utils/customIdUtils";

export const ElementsList = ({
  elements,
  setElements,
  setLiveExample,
}: {
  elements: any[];
  setElements: (elements: any[]) => void;
  setLiveExample: (example: string) => void;
}) => {
  const handleDragEnd = (result: any) => {
    const { source, destination } = result;
    if (!destination) {
      handleRemoveElement(source.index);
      return;
    }
    if (destination.index === source.index) return;

    const reordered = Array.from(elements);
    const [removed] = reordered.splice(source.index, 1);
    reordered.splice(destination.index, 0, removed);

    setElements(reordered);
    setLiveExample(generateLiveExample(reordered));
  };

  const handleRemoveElement = (index: number) => {
    const updated = elements.filter((_, i) => i !== index);
    setElements(updated);
    setLiveExample(generateLiveExample(updated));
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="droppable">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {elements.map((item, index) => (
              <Draggable
                key={item.label + index}
                draggableId={item.label + index}
                index={index}
              >
                {(provided) => (
                  <Element
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
  );
};

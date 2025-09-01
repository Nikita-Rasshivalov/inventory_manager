import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

interface ElementsListProps<T> {
  elements: T[];
  setElements: (elements: T[]) => void;
  setLiveExample?: (example: string) => void;
  renderElement: (
    item: T,
    index: number,
    onRemove: () => void,
    provided: any
  ) => React.ReactNode;
  getKey: (item: T, index: number) => string;
  generateExample?: (elements: T[]) => string;
}

export function ElementsList<T>({
  elements,
  setElements,
  setLiveExample,
  renderElement,
  getKey,
  generateExample,
}: ElementsListProps<T>) {
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

    if (setLiveExample && generateExample) {
      setLiveExample(generateExample(reordered));
    }
  };

  const handleRemoveElement = (index: number) => {
    const updated = elements.filter((_, i) => i !== index);
    setElements(updated);

    if (setLiveExample && generateExample) {
      setLiveExample(generateExample(updated));
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="droppable">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {elements.map((item, index) => (
              <Draggable
                key={getKey(item, index)}
                draggableId={getKey(item, index)}
                index={index}
              >
                {(provided) =>
                  renderElement(
                    item,
                    index,
                    () => handleRemoveElement(index),
                    provided
                  )
                }
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

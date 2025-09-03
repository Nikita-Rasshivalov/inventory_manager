import { useEffect, useState } from "react";
import {
  generateLiveExample,
  generateTemplate,
} from "../../utils/customIdUtils";
import { useInventoryStore } from "../../stores/useInventoryStore";
import { toast } from "react-toastify";
import { elementMapper } from "./elementMapper";
import { ElementsList } from "../../components/common/ElementsList";
import { CustomIdControls } from "./CustomIdControls";
import DragElement from "../../components/common/DragElementProps";

const CustomIdView = ({ inventoryId }: { inventoryId: number }) => {
  const [idElements, setIdElements] = useState<any[]>([]);
  const [liveExample, setLiveExample] = useState<string>("");
  const [newElementType, setNewElementType] = useState<string>("");
  const [fixedTextValue, setFixedTextValue] = useState<string>("");

  const { customIdTemplate, loadCustomIdTemplate, update, version } =
    useInventoryStore();

  useEffect(() => {
    const fetchTemplate = async () => await loadCustomIdTemplate(inventoryId);
    fetchTemplate();
  }, [inventoryId, loadCustomIdTemplate]);

  useEffect(() => {
    const templateArray = customIdTemplate;
    const mappedElements = templateArray.map(elementMapper);
    setIdElements(mappedElements);
    setLiveExample(generateLiveExample(mappedElements));
  }, [customIdTemplate]);

  const handleSaveTemplate = async () => {
    const template = generateTemplate(idElements);
    try {
      await update(inventoryId, { customIdFormat: template, version });
      toast.success("Template saved successfully!");
    } catch (err: any) {
      toast.error("Failed to save template", err);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Customize ID Format</h2>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <CustomIdControls
            newElementType={newElementType}
            setNewElementType={setNewElementType}
            fixedTextValue={fixedTextValue}
            setFixedTextValue={setFixedTextValue}
            idElements={idElements}
            setIdElements={setIdElements}
            liveExample={liveExample}
            onSave={handleSaveTemplate}
            setLiveExample={setLiveExample}
          />
        </div>

        <div className="md:w-2/3">
          <ElementsList
            elements={idElements}
            setElements={setIdElements}
            setLiveExample={setLiveExample}
            generateExample={generateLiveExample}
            getKey={(el, i) => el.label + i}
            renderElement={(item, _index, onRemove, provided) => (
              <DragElement
                item={item}
                provided={provided}
                onRemove={onRemove}
                isCustom={true}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomIdView;

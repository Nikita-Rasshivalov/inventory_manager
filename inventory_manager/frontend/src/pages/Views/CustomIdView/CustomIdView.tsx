import { useEffect, useState } from "react";
import {
  generateLiveExample,
  generateTemplate,
} from "../../../utils/customIdUtils";
import { useInventoryStore } from "../../../stores/useInventoryStore";
import { toast } from "react-toastify";
import { elementMapper } from "./elementMapper";
import { ElementsList } from "./ElementsList";
import { CustomIdControls } from "./CustomIdControls";

const CustomIdView = ({ inventoryId }: { inventoryId: number }) => {
  const [idElements, setIdElements] = useState<any[]>([]);
  const [liveExample, setLiveExample] = useState<string>("");
  const [newElementType, setNewElementType] = useState<string>("");
  const [fixedTextValue, setFixedTextValue] = useState<string>("");

  const { customIdTemplate, loadCustomIdTemplate, update } =
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
      await update(inventoryId, { customIdFormat: template });
      toast.success("Template saved successfully!");
    } catch (err: any) {
      toast.error("Failed to save template", err);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Customize ID Format</h2>
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
      <ElementsList
        elements={idElements}
        setElements={setIdElements}
        setLiveExample={setLiveExample}
      />
    </div>
  );
};

export default CustomIdView;

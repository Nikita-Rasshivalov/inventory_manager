import React from "react";
import DragElement from "../../../../components/common/DragElementProps";
import { ElementsList } from "../../../../components/common/ElementsList";
import { ItemFieldValue } from "../../../../models/models";

interface FieldValuesListProps {
  itemFieldValues: ItemFieldValue[];
  setItemFieldValues: (values: ItemFieldValue[]) => void;
  onRemove: (index: number) => void;
  onSelect: (index: number) => void;
}

const FieldValuesList: React.FC<FieldValuesListProps> = ({
  itemFieldValues,
  setItemFieldValues,
  onRemove,
  onSelect,
}) => (
  <div className="md:w-2/3 mt-4 md:mt-0">
    <ElementsList
      elements={itemFieldValues}
      setElements={setItemFieldValues}
      getKey={(fv, index) => (fv.id ? `${fv.id}` : `${fv.fieldId}-${index}`)}
      renderElement={(fv, index, _onRemove, provided) => (
        <div onClick={() => onSelect(index)} className="cursor-pointer">
          <DragElement
            key={fv.id ?? fv.fieldId}
            item={fv}
            provided={provided}
            onRemove={() => onRemove(index)}
            isCustom={true}
          />
        </div>
      )}
    />
  </div>
);

export default FieldValuesList;

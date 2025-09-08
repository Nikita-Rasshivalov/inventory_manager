import React from "react";
import { Plus, Save } from "lucide-react";
import FieldValueInput from "./FieldValueInput";
import Input from "../../../../components/common/Input";
import Button from "../../../../components/common/Button";

interface FieldValueFormProps {
  fields: { id: number; name: string; type?: string }[];
  selectedFieldId: number | null;
  value: any;
  setValue: (val: any) => void;
  showInTable: boolean;
  setShowInTable: (val: boolean) => void;
  onAddField: () => void;
  onSave: () => void;
  onlyShowInTable?: boolean;
  isSubmitting: boolean;
}

const FieldValueForm: React.FC<FieldValueFormProps> = ({
  fields,
  selectedFieldId,
  value,
  setValue,
  showInTable,
  setShowInTable,
  onAddField,
  onSave,
  onlyShowInTable = false,
  isSubmitting = false,
}) => (
  <>
    {!onlyShowInTable && (
      <FieldValueInput
        type={
          fields.find((f) => f.id === selectedFieldId)?.type ?? "singleLineText"
        }
        value={value}
        onChange={setValue}
      />
    )}
    <div className="flex items-center gap-2 mt-2">
      <Input
        type="checkbox"
        checked={!!showInTable}
        onChange={(e) => setShowInTable(e.target.checked)}
      />
      <div className="text-sm">Show in table</div>
    </div>
    <div className="flex gap-3 mt-2">
      {!onlyShowInTable && (
        <Button
          onClick={onAddField}
          className="border rounded px-2 py-2 text-sm min-[425px]:h-8"
        >
          <Plus size={16} />
        </Button>
      )}
      <Button
        onClick={onSave}
        className="border rounded px-2 py-2 text-sm min-[425px]:h-8"
        disabled={isSubmitting}
      >
        <Save size={16} />
      </Button>
    </div>
  </>
);

export default FieldValueForm;

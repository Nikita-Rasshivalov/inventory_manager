import CustomIdView from "../CustomIdView/CustomIdView";
import TagCategoryControls from "./TagCategoryControls";

interface SettingsViewPageProps {
  inventoryId: number;
}

const SettingsView = ({ inventoryId }: SettingsViewPageProps) => {
  return (
    <div className="space-y-6 pb-8">
      <TagCategoryControls inventoryId={inventoryId} />
      <CustomIdView inventoryId={inventoryId} />
    </div>
  );
};

export default SettingsView;

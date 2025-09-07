import { useEffect, useState } from "react";
import { useInventoryStore } from "../../stores/useInventoryStore";
import { toast } from "react-toastify";
import { useCategories } from "../../hooks/useCategories";
import { useTags } from "../../hooks/useTags";
import Select from "react-select";
import { Save } from "lucide-react";
import Button from "../../components/common/Button";
import { useTranslation } from "react-i18next";
import { getReactSelectStyles } from "./reactSelectStyles";

import CustomMarkdownEditor from "../../components/common/CustomMarkdownEditor";

interface TagCategoryControlsProps {
  inventoryId: number;
}

const TagCategoryControls = ({ inventoryId }: TagCategoryControlsProps) => {
  const { currentInventory, getById, update, loading } = useInventoryStore();
  const { data: categories = [] } = useCategories();
  const { data: tags = [] } = useTags();
  const { t } = useTranslation();

  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<
    { value: number; label: string }[]
  >([]);

  const selectStyles = getReactSelectStyles();

  useEffect(() => {
    getById(inventoryId);
  }, [inventoryId, getById]);

  useEffect(() => {
    if (currentInventory) {
      setDescription(currentInventory.description || "");
      setCategoryId(currentInventory.categoryId || null);
      setSelectedTags(
        (currentInventory.tags || []).map((t: any) => ({
          value: t.tag.id,
          label: t.tag.name,
        }))
      );
    }
  }, [currentInventory]);

  const handleSave = async () => {
    if (!currentInventory) return;
    try {
      await update(currentInventory.id, {
        description,
        categoryId: categoryId ?? undefined,
        tags: selectedTags.map((t) => ({ id: t.value })),
        version: currentInventory.version,
      });

      setDescription(description);
      setCategoryId(categoryId);
      setSelectedTags([...selectedTags]);

      toast.success("Settings updated");
    } catch (err: any) {
      toast.error(err.message || "Failed to save settings");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-gray-800 dark:text-gray-200">
          {t("description")}
        </label>
        <CustomMarkdownEditor value={description} onChange={setDescription} />
      </div>

      <div>
        <label className="block text-gray-800 dark:text-gray-200">
          {t("category")}
        </label>
        <Select
          classNamePrefix="react-select"
          options={categories.map((c: any) => ({ value: c.id, label: c.name }))}
          value={
            categoryId !== null
              ? categories
                  .map((c) => ({ value: c.id, label: c.name }))
                  .find((c) => c.value === categoryId) || null
              : null
          }
          onChange={(option: any) => setCategoryId(option?.value ?? null)}
          styles={selectStyles}
        />
      </div>

      <div>
        <label className="block text-gray-800 dark:text-gray-200">
          {t("tags")}
        </label>
        <Select
          classNamePrefix="react-select"
          isMulti
          options={tags.map((t: any) => ({ value: t.id, label: t.name }))}
          value={selectedTags}
          onChange={(options) => setSelectedTags(options ? [...options] : [])}
          styles={selectStyles}
        />
      </div>

      <Button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 flex items-center gap-2"
        onClick={handleSave}
        disabled={loading}
      >
        <Save />
      </Button>
    </div>
  );
};

export default TagCategoryControls;

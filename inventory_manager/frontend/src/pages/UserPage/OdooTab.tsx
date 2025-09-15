import { useState } from "react";
import Button from "../../components/common/Button";
import { Loader, Plus, Save } from "lucide-react";
import { toast } from "react-toastify";
import { useOdoo } from "../../hooks/Odoo/useOdoo";
import { useTemplates } from "../../hooks/Odoo/useTemplates";
import { useQuestions } from "../../hooks/Odoo/useQuestions";
import { User } from "../../models/models";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";

interface OdooTabProps {
  user: User;
}

const OdooTab = ({ user }: OdooTabProps) => {
  const { apiToken, isLoading, generateToken } = useOdoo(user.apiToken);

  const { createTemplate } = useTemplates();
  const { addQuestions } = useQuestions();

  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<{ text: string; type: string }[]>(
    []
  );
  const [saving, setSaving] = useState(false);

  const handleAddQuestion = () => {
    setQuestions([...questions, { text: "", type: "text" }]);
  };

  const handleSaveTemplate = async () => {
    if (!title.trim()) return toast.error("Template title is required");
    if (questions.length === 0) return toast.error("Add at least one question");

    try {
      setSaving(true);
      const template = await createTemplate.mutateAsync({
        name: title,
        userId: user.id,
      });
      await addQuestions.mutateAsync({ templateId: template.id, questions });
      toast.success("Template saved successfully!");
      setTitle("");
      setQuestions([]);
    } catch (err: any) {
      toast.error(err.message || "Error saving template");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Odoo Integration
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
          <Button
            onClick={() => generateToken()}
            disabled={isLoading}
            className="flex-1 sm:flex-none"
          >
            {isLoading ? (
              <Loader className="animate-spin w-4 h-4" />
            ) : (
              "Regenerate"
            )}
          </Button>

          {apiToken && (
            <div className="text-sm text-gray-700 dark:text-gray-300 w-full sm:max-w-md break-words mt-2 sm:mt-0">
              <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                {apiToken}
              </code>
            </div>
          )}
        </div>
      </div>

      {apiToken && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 space-y-4">
          <h3 className="text-md font-semibold text-gray-900 dark:text-gray-100">
            Create Template
          </h3>

          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Template title"
            className="w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-gray-100"
          />

          <div className="space-y-3">
            {questions.map((q, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row gap-2 items-start sm:items-center bg-gray-50 dark:bg-gray-700 p-2 rounded-lg"
              >
                <Input
                  type="text"
                  value={q.text}
                  onChange={(e) => {
                    const newQ = [...questions];
                    newQ[idx].text = e.target.value;
                    setQuestions(newQ);
                  }}
                  placeholder={`Question ${idx + 1}`}
                  className=" w-full border rounded px-2 py-1 dark:bg-gray-600 dark:text-gray-100"
                />
                <Select
                  value={q.type}
                  onChange={(e) => {
                    const newQ = [...questions];
                    newQ[idx].type = e.target.value;
                    setQuestions(newQ);
                  }}
                  className="h-10 border rounded px-2 py-1 dark:bg-gray-600 dark:text-gray-100"
                >
                  <option value="text">Text</option>
                  <option value="number">Number</option>
                </Select>
              </div>
            ))}
          </div>

          <div className="flex gap-3 flex-wrap">
            <Button
              onClick={handleAddQuestion}
              className="flex items-center bg-gray-600 hover:bg-gray-700 text-white dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              <Plus className="w-4 h-4" />
            </Button>
            <Button
              onClick={handleSaveTemplate}
              disabled={saving}
              className="flex items-center bg-gray-600 hover:bg-gray-700 text-white dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              {saving ? (
                <Loader className="animate-spin w-4 h-4 mr-1" />
              ) : (
                <Save className="w-4 h-4 mr-1" />
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OdooTab;

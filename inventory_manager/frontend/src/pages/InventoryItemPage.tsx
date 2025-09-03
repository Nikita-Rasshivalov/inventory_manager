import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Pencil, ArrowLeft, Save } from "lucide-react";
import ItemPage from "./ItemPage/ItemPage";
import { useInventoryStore } from "../stores/useInventoryStore";
import Header from "../components/layout/Header";

const InventoryItemPage = () => {
  const { inventoryId } = useParams<{ inventoryId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { update, getById, version } = useInventoryStore();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingPublic, setIsEditingPublic] = useState(false);
  const [titleDraft, setTitleDraft] = useState(
    (location.state?.inventoryTitle as string) || ""
  );
  const [isPublicDraft, setIsPublicDraft] = useState(false);

  useEffect(() => {
    if (inventoryId) {
      getById(Number(inventoryId)).then((inv) => {
        setTitleDraft(inv.title);
        setIsPublicDraft(inv.isPublic ?? false);
      });
    }
  }, [inventoryId, getById]);

  const handleSaveTitle = () => {
    if (titleDraft.trim()) {
      update(Number(inventoryId), {
        title: titleDraft,
        version,
      });
      setIsEditingTitle(false);
    }
  };

  const handleSavePublic = () => {
    update(Number(inventoryId), {
      isPublic: isPublicDraft,
      version,
    });
    setIsEditingPublic(false);
  };

  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto px-0 sm:px-6 py-8 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-between px-4 mb-6">
          <div className="flex items-center gap-2">
            <ArrowLeft
              size={20}
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
              onClick={() => navigate(-1)}
            />

            {isEditingTitle ? (
              <input
                className="border rounded px-2 py-1 text-xl font-semibold"
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                onBlur={handleSaveTitle}
                onKeyDown={(e) => e.key === "Enter" && handleSaveTitle()}
                autoFocus
              />
            ) : (
              <>
                <h1 className="text-2xl font-bold">{titleDraft}</h1>
                <Pencil
                  size={20}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                  onClick={() => setIsEditingTitle(true)}
                />
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isEditingPublic ? (
              <>
                <input
                  type="checkbox"
                  checked={isPublicDraft}
                  onChange={(e) => setIsPublicDraft(e.target.checked)}
                  className="h-5 w-5 cursor-pointer"
                  autoFocus
                />
                <button
                  onClick={handleSavePublic}
                  className="ml-1 text-gray-600 hover:text-gray-800 font-medium"
                >
                  <Save />
                </button>
              </>
            ) : (
              <>
                <span className="ml-1">Public:</span>
                <input
                  type="checkbox"
                  checked={isPublicDraft}
                  readOnly
                  className="h-5 w-5 cursor-not-allowed"
                />
                <Pencil
                  size={16}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer ml-1"
                  onClick={() => setIsEditingPublic(true)}
                />
              </>
            )}
          </div>
        </div>

        <ItemPage inventoryId={Number(inventoryId)} />
      </div>
    </>
  );
};

export default InventoryItemPage;

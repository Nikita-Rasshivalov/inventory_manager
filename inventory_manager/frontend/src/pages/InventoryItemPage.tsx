import { useState, useEffect, useMemo } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Pencil, ArrowLeft, Save } from "lucide-react";
import ItemPage from "./ItemPage/ItemPage";
import { useInventoryStore } from "../stores/useInventoryStore";
import Header from "../components/layout/Header";
import { useAuthStore } from "../stores/useAuthStore";
import { InventoryRole, SystemRole } from "../models/models";
import Button from "../components/common/Button";

const InventoryItemPage = () => {
  const { inventoryId } = useParams<{ inventoryId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { update, getById, version, inventoryMembers } = useInventoryStore();
  const { user } = useAuthStore();

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

  const canEdit = useMemo(() => {
    if (!user) return false;
    if (user.role === SystemRole.ADMIN) return true;
    const member = inventoryMembers?.find((m) => m.userId === user.id);
    return member?.role === InventoryRole.OWNER;
  }, [user, inventoryMembers]);

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
      <div className="max-w-5xl mx-auto mt-2 px-0 sm:px-6 py-0 pt-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg shadow-md transition-colors duration-300">
        <div className="flex items-center justify-between px-4 mb-6">
          <div className="flex items-center gap-2">
            <ArrowLeft
              size={20}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer transition-colors duration-200"
              onClick={() => navigate(-1)}
            />

            {isEditingTitle && canEdit ? (
              <input
                className="border rounded px-2 py-1 text-xl font-semibold bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
                onBlur={handleSaveTitle}
                onKeyDown={(e) => e.key === "Enter" && handleSaveTitle()}
                autoFocus
              />
            ) : (
              <>
                <h1 className="text-2xl font-bold">{titleDraft}</h1>
                {canEdit && (
                  <Pencil
                    size={20}
                    className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer transition-colors duration-200"
                    onClick={() => setIsEditingTitle(true)}
                  />
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isEditingPublic && canEdit ? (
              <>
                <input
                  type="checkbox"
                  checked={isPublicDraft}
                  onChange={(e) => setIsPublicDraft(e.target.checked)}
                  className="h-5 w-5 cursor-pointer accent-blue-600"
                  autoFocus
                />
                <Button
                  onClick={handleSavePublic}
                  className="ml-1 bg-transparent text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 font-medium transition-colors duration-200"
                >
                  <Save />
                </Button>
              </>
            ) : (
              <>
                <span className="ml-1">Public:</span>
                <input
                  type="checkbox"
                  checked={isPublicDraft}
                  readOnly
                  className="h-5 w-5 cursor-not-allowed accent-blue-600"
                />
                {canEdit && (
                  <Pencil
                    size={16}
                    className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer ml-1 transition-colors duration-200"
                    onClick={() => setIsEditingPublic(true)}
                  />
                )}
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

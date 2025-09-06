import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Header from "../../components/layout/Header";
import { useAuth } from "../../hooks/useAuth";
import ProfileTab from "./ProfileTab";
import Button from "../../components/common/Button";
import { useUserStore } from "../../stores/useUserStore";
import { User } from "../../models/models";
import InventoryPage from "../InventoryPage/InventoryPage";
import { Loader } from "lucide-react";
import { useTranslation } from "react-i18next";

enum ProfileTabs {
  PROFILE = "profile_tab",
  INVENTORIES = "inventories_tab",
}
const UserProfilePage = () => {
  const { t } = useTranslation();
  const { user: currentUser } = useAuth();
  const { userId } = useParams<{ userId: string }>();
  const getById = useUserStore((state) => state.getById);

  const [user, setUser] = useState<User | null>(currentUser || null);
  const [loading, setLoading] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") as ProfileTabs | null;
  const [activeTab, setActiveTab] = useState<ProfileTabs>(
    initialTab || ProfileTabs.PROFILE
  );

  useEffect(() => {
    const fetchUser = async () => {
      if (userId && +userId !== currentUser?.id) {
        setLoading(true);
        const fetchedUser = await getById(+userId);
        setUser(fetchedUser);
        setLoading(false);
      } else {
        setUser(currentUser);
      }
    };
    fetchUser();
  }, [userId, currentUser, getById]);

  useEffect(() => {
    setSearchParams({ tab: activeTab });
  }, [activeTab, setSearchParams]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader className="animate-spin text-gray-700 dark:text-gray-200" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 text-center text-gray-900 dark:text-gray-200">
        {t("user_not_found")}
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto pt-2 pb-0 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-colors duration-300">
        <div className="flex border-b px-6 py-2 border-gray-200 dark:border-gray-600 gap-2">
          {Object.values(ProfileTabs).map((tab) => (
            <Button
              key={tab}
              onClick={() => setActiveTab(tab as ProfileTabs)}
              active={activeTab === tab}
              className={`px-4 py-2 rounded-lg text-xs sm:text-sm md:text-base font-medium truncate min-w-[120px] flex-shrink-0 transition-colors duration-200 ${
                activeTab === tab
                  ? "bg-blue-600 text-white dark:bg-blue-500 dark:hover:bg-blue-400 dark:text-gray-100"
                  : "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 hover:bg-gray-300"
              }`}
            >
              {t(tab)}
            </Button>
          ))}
        </div>

        {activeTab === ProfileTabs.PROFILE && <ProfileTab user={user} />}
        {activeTab === ProfileTabs.INVENTORIES && <InventoryPage />}
      </div>
    </>
  );
};

export default UserProfilePage;

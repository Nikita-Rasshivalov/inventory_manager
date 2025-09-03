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

enum ProfileTabs {
  PROFILE = "Profile",
  INVENTORIES = "Inventories",
}

const UserProfilePage = () => {
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
    return <Loader />;
  }

  if (!user) {
    return <div className="p-6 text-center">User not found.</div>;
  }

  return (
    <>
      <Header />

      <div className="max-w-4xl mx-auto pt-2 pb-0 p-6 bg-white rounded-xl shadow-lg">
        <div className="flex border-b px-6 py-2 border-gray-200 gap-2">
          {Object.values(ProfileTabs).map((tab) => (
            <Button
              key={tab}
              onClick={() => setActiveTab(tab as ProfileTabs)}
              active={activeTab === tab}
              className="px-4 py-2 rounded-lg text-xs sm:text-sm md:text-base font-medium truncate min-w-[120px] flex-shrink-0"
            >
              {tab}
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

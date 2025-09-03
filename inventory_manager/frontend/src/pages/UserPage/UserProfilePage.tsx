import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/layout/Header";
import { useAuth } from "../../hooks/useAuth";
import ProfileTab from "./ProfileTab";
import Button from "../../components/common/Button";
import { useUserStore } from "../../stores/useUserStore";
import { User } from "../../models/models";

enum ProfileTabs {
  PROFILE = "Profile",
  INVENTORIES = "Inventories",
}

const UserProfilePage = () => {
  const { user: currentUser } = useAuth();
  const { userId } = useParams<{ userId: string }>();
  const getById = useUserStore((state) => state.getById);

  const [user, setUser] = useState<User | null>(currentUser || null);
  const [activeTab, setActiveTab] = useState<ProfileTabs>(ProfileTabs.PROFILE);
  const [loading, setLoading] = useState(false);

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

  if (loading) {
    return <div className="p-6 text-center">Loading user...</div>;
  }

  if (!user) {
    return <div className="p-6 text-center">User not found.</div>;
  }

  return (
    <>
      <Header />

      <div className="max-w-4xl mx-auto mt-6 p-6 bg-white rounded-xl shadow-lg">
        <div className="flex border-b p-6 border-gray-200 mb-6 gap-2">
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

        {activeTab === ProfileTabs.INVENTORIES && (
          <div className="text-gray-500">
            Inventories tab is under construction.
          </div>
        )}
      </div>
    </>
  );
};

export default UserProfilePage;

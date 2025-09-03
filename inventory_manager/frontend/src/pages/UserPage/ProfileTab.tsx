import AvatarUploader from "./AvatarUploader";
import { User } from "../../models/models";
import { useAuth } from "../../hooks/useAuth";

interface ProfileTabProps {
  user: User;
}

const ProfileTab = ({ user }: ProfileTabProps) => {
  const { user: currentUser } = useAuth();
  const isCurrentUser = currentUser?.id === user.id;

  return (
    <div className="flex flex-col mt-4 pb-2 md:flex-row items-center gap-6">
      {isCurrentUser ? (
        <AvatarUploader currentUrl={user.imageUrl || ""} />
      ) : (
        <div className="w-32 h-32 rounded-full overflow-hidden shadow-md mb-4">
          <img
            src={user.imageUrl || "/default-avatar.png"}
            alt={user.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-4">{user.name}</h2>
        <div className="space-y-3 text-gray-700">
          <p>
            <span className="font-semibold">Email:</span> {user.email}
          </p>
          <p>
            <span className="font-semibold">System Role:</span>
            {user.role || "-"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;

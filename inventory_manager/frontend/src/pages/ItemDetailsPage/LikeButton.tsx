import { Heart } from "lucide-react";
import { useState } from "react";
import { User, Like } from "../../models/models";
import { useItemLikesSocket } from "../../hooks/useItemLikesSocket"; // путь к твоему хуку

interface LikeButtonProps {
  itemId: number;
  currentUser: User;
  initialLikes: Like[];
}

const LikeButton = ({ itemId, currentUser, initialLikes }: LikeButtonProps) => {
  const [likes, setLikes] = useState<Like[]>(initialLikes);

  const { toggleLike } = useItemLikesSocket({
    itemId,
    onInitialLikes: setLikes,
    onItemLiked: setLikes,
  });

  const likedByCurrentUser = likes.some((l) => l.userId === currentUser.id);

  return (
    <div
      className="flex items-center ml-3 gap-1 cursor-pointer"
      onClick={() => toggleLike(currentUser.id)} // эмит события на сервер
    >
      <Heart
        size={20}
        color={likedByCurrentUser ? "red" : "gray"}
        fill={likedByCurrentUser ? "red" : "none"}
      />
      <span className="text-sm">{likes.length}</span>
    </div>
  );
};

export default LikeButton;

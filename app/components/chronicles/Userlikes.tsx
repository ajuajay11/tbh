'use client';
import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
 
type Like = {
  _id: string;
  like: boolean;
  createdAt: string;
  user?: {
    name?: string;
    userId?: string;
  };
};

type UserLikesProps = {
  Pid: string;
  likes: Like[];
  likeCount: number;
};

function UserLikes({ Pid, likes: initialLikes, likeCount: initialCount }: UserLikesProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [likes, setLikes] = useState<Like[]>(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    const uid = Cookies.get("userId") || null;
    const tok = Cookies.get("token") || null;

    setUserId(uid);
    setToken(tok);

    if (uid) {
      const liked = likes.some(like => like.user?.userId === uid && like.like);
      setHasLiked(liked);
      setCount(likes.filter(l => l.like).length);
    }
  }, [likes]);

  const toggleLike = async () => {
    if (!token || !userId) return;

    const nextLiked = !hasLiked;
    let updatedLikes: Like[];
    const existingIndex = likes.findIndex(l => l.user?.userId === userId);
    if (existingIndex !== -1) {
      updatedLikes = [...likes];
      updatedLikes[existingIndex].like = nextLiked;
    } else {
      updatedLikes = [
        ...likes,
        {
          _id: Math.random().toString(), // fake id
          like: nextLiked,
          createdAt: new Date().toISOString(),
          user: {
            userId,
            name: "You", // Optional
          },
        },
      ];
    }

    setLikes(updatedLikes);
    setHasLiked(nextLiked);
    setCount(updatedLikes.filter(l => l.like).length);

    try {
      await axios.post(`/api/addChronicles/${Pid}/isLiked`, {
        isLiked: nextLiked,
      }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error("API error, reverting like", err);
      // Rollback optimistic update
      setLikes(likes);
      setHasLiked(!nextLiked);
      setCount(initialLikes.filter(l => l.like).length);
    }
  };

  if (!userId) return null;

  return (
    <div>
      <button onClick={toggleLike} className="flex items-center gap-2">
      {hasLiked ? (
        <svg className="w-6 h-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
          <path d="m12.75 20.66 6.184-7.098c2.677-2.884 2.559-6.506.754-8.705-.898-1.095-2.206-1.816-3.72-1.855-1.293-.034-2.652.43-3.963 1.442-1.315-1.012-2.678-1.476-3.973-1.442-1.515.04-2.825.76-3.724 1.855-1.806 2.201-1.915 5.823.772 8.706l6.183 7.097c.19.216.46.34.743.34a.985.985 0 0 0 .743-.34Z" />
        </svg>
      ) : (
        <svg className="w-6 h-6 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12.01 6.001C6.5 1 1 8 5.782 13.001L12.011 20l6.23-7C23 8 17.5 1 12.01 6.002Z" />
        </svg>
      )}
    </button>
      {count > 0 ? <span className="text-white">{count}</span> : null}
    </div>
  );
}

export default UserLikes;

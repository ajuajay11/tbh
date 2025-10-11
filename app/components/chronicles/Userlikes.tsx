'use client';
import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
 import { HeartHandshake, Heart} from 'lucide-react';
 
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
    <div className="flex items-center gap-1">
      <button onClick={toggleLike} className="flex items-center gap-2">
      {hasLiked ? (
        <HeartHandshake />
      ) : (
        <Heart  />
      )}
    </button>
      {count > 0 ? <span className="text-white">{count}</span> : null}
    </div>
  );
}

export default UserLikes;
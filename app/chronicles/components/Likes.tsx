"use client";
import { Heart } from "lucide-react";
import Cookies from "js-cookie";
import { getBaseUrl } from "@/lib/getBaseUrl";
import { useEffect, useState } from "react";
import axios from "axios";
interface LikesProps {
  userLikesData: string[]; // ✅ matches Chronicle.UserLikes
  Pid: string;
}
export default function Comments({ Pid, userLikesData }: LikesProps) {
  const UserId = Cookies.get("userId");
  const token = Cookies.get("token");
  const [hasLiked, setHasLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    if (!UserId) return;
    const filterLike = userLikesData.some((e) => e == UserId);
    setLikeCount(userLikesData.length); // ✅ count total likes
    if (filterLike) {
      setHasLiked(true);
       console.log(likeCount,'likeCount');
       
    }
  }, [UserId, userLikesData, likeCount]);

  const toggleLike = async () => {
    const newLikedState = !hasLiked;
    setHasLiked(newLikedState);
    try {
      const res = await axios.post( `${getBaseUrl()}/api/addChronicles/${Pid}/isLiked`, {
          isLiked: newLikedState,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLikeCount(res?.data.likeCount ?? (newLikedState
        ? likeCount + 1
        : likeCount - 1));
    } catch (err) {
      console.error("API error, reverting like", err);
      setHasLiked(!newLikedState);
    }
  };
  return (
    <>
      <div className="mt-1 bg-sky-300 p-4 flex items-center gap-2">
      <button onClick={toggleLike}>
        {hasLiked ? <Heart style={{ color: "red" }} /> : <Heart />}
      </button>
      <span>{likeCount}</span>
    </div>
    </>
  );
}

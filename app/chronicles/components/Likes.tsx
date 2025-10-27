"use client";
import { Heart } from "lucide-react";
import Cookies from "js-cookie";
import { getBaseUrl } from "@/lib/getBaseUrl";
import { useEffect, useState } from "react";
import axios from "axios";
import {  UserLike  } from "@/app/types/chronicle";

interface LikesProps {
  userLikesData: UserLike[] | string[];  // Array of Pid strings
  Pid: string;
}
export default function Likes({ Pid, userLikesData }: LikesProps) {
  const UserId = Cookies.get("userId");
  const token = Cookies.get("token");
  const [hasLiked, setHasLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

useEffect(() => {
  if (!UserId || !userLikesData) return;

  const filterLike = userLikesData.some((like) => like === UserId);

  setLikeCount(userLikesData.length);
  setHasLiked(filterLike);
}, [UserId, userLikesData]);


  const toggleLike = async () => {
    const newLikedState = !hasLiked;
    setHasLiked(newLikedState);
    try {
      const res = await axios.post(
        `${getBaseUrl()}/api/addChronicles/${Pid}/isLiked`,
        {
          isLiked: newLikedState,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLikeCount(
        res?.data.likeCount ?? (newLikedState ? likeCount + 1 : likeCount - 1)
      );
    } catch (err) {
      console.error("API error, reverting like", err);
      setHasLiked(!newLikedState);
    }
  };
  return (
    <>
      <div className="mt-1 flex flex-col items-center text-[#333]">
        <button onClick={toggleLike}>
          {hasLiked ? <Heart fill="red" /> : <Heart  />}
        </button>
        <span>{likeCount === 0 ? "likes": likeCount}</span>
      </div>
    </>
  );
}

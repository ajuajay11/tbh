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
export default function Likes({ Pid, userLikesData }: LikesProps) {
  const UserId = Cookies.get("userId");
  const token = Cookies.get("token");
  const [hasLiked, setHasLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    if (!UserId || !userLikesData) return;

    console.log(userLikesData, "filterLike");

    const filterLike = userLikesData.includes(UserId); // ✅ simpler for array of strings
    console.log(filterLike);

    setLikeCount(userLikesData.length); // total likes
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
      <div className="mt-1 p-4 flex flex-col items-center ">
        <button onClick={toggleLike}>
          {hasLiked ? <Heart fill="red" /> : <Heart stroke="gray" />}
        </button>
        <span>{likeCount === 0 ? "likes": likeCount}</span>
      </div>
    </>
  );
}

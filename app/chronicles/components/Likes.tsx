"use client";
import { Heart } from "lucide-react";
import Cookies from "js-cookie";
import { getBaseUrl } from "@/lib/getBaseUrl";
import { useEffect, useState } from "react";
import axios from "axios";
import { UserLike } from "@/app/types/chronicle";
import { usePathname } from "next/navigation"; // ✅ Import this

interface LikesProps {
  userLikesData: UserLike[] | string[]; // Array of Pid strings
  Pid: string;
}
export default function Likes({ Pid, userLikesData }: LikesProps) {
  const pathname = usePathname(); // ✅ Get the current route

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
  const layoutClass = pathname === "/chronicles" ? "flex-col" : "flex";
  return (
    <>
      <div
        className={[
          "p-3",
          pathname === "/chronicles"
            ? "bg-[#fffff0]"
            : "rounded-full shadow-lg flex flex-col items-center gap-0",
          hasLiked && pathname !== "/chroncicles"
            ? "text-red-500"
            : "text-[#a1a1a1]",
        ].join(" ")}
      >
        {" "}
        <button onClick={toggleLike} className={`${layoutClass} m-0 gap-1`}>
          {hasLiked ? <Heart fill="red" /> : <Heart />}
          <span className="text-[#a1a1a1] m-0 ">
            {likeCount === 0 ? null : likeCount}
          </span>
        </button>
      </div>
    </>
  );
}

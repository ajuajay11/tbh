"use client";
import { Heart } from "lucide-react";
import Cookies from "js-cookie";
import { UserLike } from "../../types/chronicle";
import { useEffect, useState } from "react";
import axios from "axios";
interface CommentsProps {
  userLikesData: UserLike[]; // Array of comments
  Pid:string
}
export default function Comments({Pid, userLikesData }: CommentsProps) {
  const UserId = Cookies.get("userId");
  const token = Cookies.get("token");
  const [hasLiked, setHasLiked] = useState(false);
  const [likeCount , setLikeCount]= useState(null)
  console.log(UserId, userLikesData,'userLikesData');
  
  const toggleLike = async() => {
    const newLikedState = !hasLiked;
      setHasLiked(newLikedState);
    try {
      const res = await axios.post(`/api/addChronicles/${Pid}/isLiked`,
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
      console.log(res);
     setLikeCount(res?.data.likeCount)
    } catch (err) {
      console.error("API error, reverting like", err);
      setHasLiked(hasLiked);
    }
  };
  return (
    <>
      <div className="comments mt-1 bg-sky-300 p-4">
        
        
        <button onClick={toggleLike}>
          {hasLiked ? <Heart style={{ color: "red" }} /> : <Heart />}
        </button>
        {likeCount} Likes
      </div>
    </>
  );
}

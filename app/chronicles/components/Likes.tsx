'use client'
import { HeartHandshake, Heart } from 'lucide-react';
import Cookies from 'js-cookie';
import { UserLike } from "../../types/chronicle";
import { useEffect, useState } from 'react';
import axios from 'axios';
interface CommentsProps {
  userLikesData: UserLike[]; // Array of comments
  pid:string
 }
export default function Comments({pid,   userLikesData }: CommentsProps) {
  const [hasLiked, setHasLiked] = useState(false)
  const UserId = Cookies.get('userId');
  const token = Cookies.get('token');
  const nextLike = !hasLiked
  useEffect(() => {
    setHasLiked(userLikesData.some(user => user.user.userId == UserId));
  }, [userLikesData, UserId]);
 
  const likedFn = async() => {
     try {
      const res = await axios.post(`/api/addChronicles/${pid}/isLiked`, {
        isLiked: nextLike,
      }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res,'res');
      
    } catch (err) {
      console.error("API error, reverting like", err);
    }
  }
  return (

    <>
      <div className="comments mt-1 bg-sky-300 p-4">
        <button style={{cursor:'pointer'}} onClick={likedFn}>{hasLiked ? (
          <HeartHandshake />
        ) : (
          <Heart />
        )}
        </button>

        {userLikesData.length} Likes
      </div>
    </>
  );
}



'use client'
import { Heart } from 'lucide-react';
import Cookies from 'js-cookie';
import {UserLike} from "../../types/chronicle";
 interface CommentsProps {
  userLikesData: UserLike[]; // Array of comments
}
export default function Comments({userLikesData} :CommentsProps) {
   const UserId = Cookies.get('userId')
  const isLikedByUser = userLikesData.some(user =>user.user.userId == UserId)
   
  return (
 
    <>
      <div className="comments mt-1 bg-sky-300 p-4">
        <span>{isLikedByUser ? (<Heart />) : (<Heart/>)}
           </span>
        
         {userLikesData.length} Likes
      </div>
    </>
  );
}

 

"use client";
import axios from "axios";
import { useState, FormEvent } from "react";
import { UserComment } from "../../types/chronicle";
import Cookies from "js-cookie";
import { getBaseUrl } from "@/lib/getBaseUrl";
interface CommentsProps {
  userCommentsData: UserComment[]; // Array of comments
  Pid: string;
  user?: {
    firstname: string;
    lastname: string;
    username: string;
    userId: string;
  };
}
export default function Comments({ Pid, userCommentsData }: CommentsProps) {
  //   const UserId = Cookies.get("userId");
  const token = Cookies.get("token");
  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState<UserComment[]>(userCommentsData)
  const addComment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      const res = await axios.post(
        `${getBaseUrl()}/api/addChronicles/${Pid}/comments`,
        {
          comment: comment,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res);
      if (res.status === 200) {
        console.log("Comment added successfully");
        
        // Correctly add the new comment to state
        setAllComments(prevComments => [...prevComments, res.data.user]);
        
        // Clear the input field
        setComment("");
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <div className="comments mt-1 bg-sky-300 p-4">
        {allComments.map((comment, id) => (
          <div key={comment._id || id}>
            <p className="text-gray-500">{comment.comment}</p>fff
          </div>
        ))}
      </div>
      <form
        onSubmit={addComment}
        className="flex flex-col sm:flex-row items-center gap-3 mt-4 bg-gray-100 p-4 rounded-xl shadow-sm"
      >
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Please type your comment..."
          required
          id="comment"
          className="flex-1 w-full text-dark px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent bg-white"
        />
        <input
          type="submit"
          value="Submit"
          className="px-5 py-2 bg-sky-500 text-white font-semibold rounded-lg hover:bg-sky-600 transition-colors cursor-pointer w-full sm:w-auto"
        />
      </form>
    </>
  );
}

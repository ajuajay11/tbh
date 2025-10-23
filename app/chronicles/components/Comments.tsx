"use client";
import axios from "axios";
import { useState, FormEvent } from "react";
import { UserComment } from "../../types/chronicle";
import Cookies from "js-cookie";
import { MessageCircle } from "lucide-react";
import Style from "../chronicle.module.css";
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
  const [isCommentOpen, setCommentOpen] = useState(false);
  const [allComments, setAllComments] =
    useState<UserComment[]>(userCommentsData);
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
        setAllComments((prevComments) => [...prevComments, res.data.user]);

        // Clear the input field
        setComment("");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const commentFn = () => {
    setCommentOpen((addComment) => !addComment);
    console.log(isCommentOpen);
  };
  return (
    <>
      <button onClick={commentFn} className="flex flex-col items-center">
        <MessageCircle className="w-6 h-6" />
        <span className="text-xs mt-1">{allComments?.length || null}</span>
      </button>

      {/* Backdrop overlay */}
      {isCommentOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={commentFn}
        />
      )}

      {/* Comment section - slides from bottom */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
          isCommentOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ maxHeight: "70vh" }}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-4 pb-3 border-b border-gray-200">
          <h3 className="text-center font-semibold text-lg">Comments</h3>
        </div>

        {/* Comments list - scrollable */}
        <div
          className="overflow-y-auto px-4 py-3"
          style={{ maxHeight: "calc(70vh - 180px)" }}
        >
          {allComments.length > 0 ? (
            allComments.map((comment, id) => (
              <div key={comment._id || id} className="mb-4 animate-fadeIn">
                <p className="text-gray-800">{comment.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center py-8">
              No comments yet. Be the first!
            </p>
          )}
        </div>

        {/* Comment input form - fixed at bottom */}
        <form
          onSubmit={addComment}
          className="flex items-center gap-2 p-4 border-t border-gray-200 bg-white"
        >
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            required
            id="comment"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent bg-gray-50"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-sky-500 text-white font-semibold rounded-full hover:bg-sky-600 transition-colors"
          >
            Post
          </button>
        </form>
      </div>
    </>
  );
}

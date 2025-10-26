"use client";

import axios from "axios";
import { useState, FormEvent } from "react";
import Cookies from "js-cookie";
import { Trash2, X, MessageCircle } from "lucide-react"
import { getBaseUrl } from "@/lib/getBaseUrl";
import { UserComment } from "../../types/chronicle";

interface CommentsProps {
  userCommentsData: UserComment[];
  Pid: string;
}

export default function Comments({ Pid, userCommentsData }: CommentsProps) {
  const token = Cookies.get("token");
  const [comment, setComment] = useState("");
  const [isCommentOpen, setCommentOpen] = useState(false);
  const [allComments, setAllComments] = useState<UserComment[]>(userCommentsData);

  const toggleComments = () => {
    setCommentOpen((prev) => !prev);
  };

  const addComment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const res = await axios.post(
        `${getBaseUrl()}/api/addChronicles/${Pid}/comments`,
        { comment },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        setAllComments((prev) => [...prev, res.data.user]);
        setComment("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteComment = async (Cid: string) => {
    try {
      const res = await axios.delete(`${getBaseUrl()}/api/addChronicles/${Pid}/comments?Cid=${Cid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        setAllComments((prev) => prev.filter((c) => c._id !== Cid));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <button onClick={toggleComments} className="flex flex-col items-center text-[#333]">
        <MessageCircle className="w-6 h-6" />
        <span className="text-xs mt-1">{allComments?.length || null}</span>
      </button>

      {isCommentOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm z-[998]"
            onClick={toggleComments}
          />

          {/* Bottom Modal */}
          <div
            className={`fixed bottom-0 left-0 right-0 bg-neutral-900 rounded-t-3xl shadow-2xl z-[999] transform transition-transform duration-300 ease-out ${isCommentOpen ? "translate-y-0" : "translate-y-full"
              }`}
            style={{ maxHeight: "80vh" }}
          >
            {/* Top handle + close */}
            <div className="flex justify-between items-center px-4 pt-4 pb-2 border-b border-neutral-700">
              <div className="w-12 h-1 bg-neutral-600 rounded-full mx-auto"></div>
              <button
                onClick={toggleComments}
                className="absolute right-4 top-4 text-neutral-400 hover:text-white transition"
              >
                <X size={22} />
              </button>
            </div>

            {/* Header */}
            <div className="px-4 pb-3 border-b border-neutral-700">
              <h3 className="text-center font-semibold text-lg text-white">
                Comments
              </h3>
            </div>

            {/* Comments list */}
            <div
              className="overflow-y-auto px-4 py-4"
              style={{ maxHeight: "calc(80vh - 180px)" }}
            >
              {allComments.length > 0 ? (
                allComments.map((comment, id) => (
                  <div
                    key={comment._id || id}
                    className="group relative mb-4 p-3 rounded-xl bg-neutral-800 hover:bg-neutral-750 transition"
                  >
                    <p className="text-gray-200 text-sm leading-relaxed">
                      {comment.comment}
                    </p>

                    {/* Delete icon on hover */}
                    <button
                      onClick={() => deleteComment(comment._id)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-neutral-500 hover:text-red-600"
                      title="Delete comment"
                    >
                      <Trash2 size={18} strokeWidth={2} />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-neutral-500 text-center py-10">
                  No comments yet. Be the first!
                </p>
              )}
            </div>

            {/* Comment input */}
            <form
              onSubmit={addComment}
              className="flex items-center gap-2 p-4 border-t border-neutral-700 bg-neutral-900"
            >
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-full text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-600"
                required
              />
              <button
                type="submit"
                className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
              >
                Post
              </button>
            </form>
          </div>
        </>
      )}
    </>
  );
}

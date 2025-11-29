"use client";

import axios from "axios";
import { useState, FormEvent } from "react";
import Cookies from "js-cookie";
import { Trash2, X, MessageCircle } from "lucide-react"
import { getBaseUrl } from "@/lib/getBaseUrl";
import { UserComment } from "../../types/chronicle";
import { usePathname } from "next/navigation"; // ✅ Import this

interface CommentsProps {
  userCommentsData: UserComment[];
  Pid: string;
}

export default function Comments({ Pid, userCommentsData }: CommentsProps) {
  const pathname = usePathname(); 
  const token = Cookies.get("token");
  const userId = Cookies.get("userId");
  const [comment, setComment] = useState("");
  const [isCommentOpen, setCommentOpen] = useState(false);
  const [allComments, setAllComments] = useState<UserComment[]>(userCommentsData);
  const [loading, setLoading] = useState(false);

  const toggleComments = () => {
    setCommentOpen((prev) => !prev);
  };

  const addComment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setLoading(true)
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
        setCommentOpen(false)
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
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
  const layoutClass =
    pathname === "/chronicles"
      ? "flex-col"
      : "flex";

  return (
    <>
      <button onClick={toggleComments} className={`${pathname=='/chronicles' ? 'bg-[#fffff0]' : ''} p-3 text-[#a1a1a1] rounded-full shadow-lg items-center ${layoutClass} gap-1`}>
        <MessageCircle className="w-6 h-6" />
        <span className="text-[#a1a1a1] m-0">{allComments?.length || null}</span>
      </button>
      {console.log(allComments)}
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
            <div className="flex justify-between items-center px-4 pt-4 pb-2 ">
              <div className="w-12 h-1 bg-neutral-600 rounded-full mx-auto"></div>
              <button  
                onClick={toggleComments} aria-label="close"
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
                    {comment.user.userId ===  userId? <button
                      onClick={() => deleteComment(comment._id)} aria-label="trash"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-neutral-500 hover:text-red-600"
                      title="Delete comment"
                    >
                      <Trash2 size={18} strokeWidth={2} />
                    </button> : null}
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
              className="flex items-center  gap-2 p-4 border-t border-neutral-700 bg-neutral-900 pb-20"
            >
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-4 py-2 bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-600"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className={`tbh_button m-0 ${loading
                  ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                  : "hover:bg-red-600"
                  }`}
              >
                {loading ? "..." : "Post"}
              </button>

            </form>
          </div>
        </>
      )}
    </>
  );
}

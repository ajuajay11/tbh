"use client";

import axios from "axios";
import { useState, FormEvent } from "react";
import Cookies from "js-cookie";
import { MessageCircle } from "lucide-react";
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
            className="fixed inset-0 bg-black bg-opacity-50 z-[998]"
            onClick={toggleComments}
          />

          {/* Bottom Modal */}
          <div
            className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-[999] transform transition-transform duration-300 ease-out ${
              isCommentOpen ? "translate-y-0" : "translate-y-full"
            }`}
            style={{ maxHeight: "70vh" }}
          >
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1 bg-gray-300 rounded-full" />
            </div>

            <div className="px-4 pb-3 border-b border-gray-200">
              <h3 className="text-center font-semibold text-lg">Comments</h3>
            </div>

            <div
              className="overflow-y-auto px-4 py-3"
              style={{ maxHeight: "calc(70vh - 180px)" }}
            >
              {allComments.length > 0 ? (
                allComments.map((comment, id) => (
                  <div key={comment._id || id} className="mb-4">
                    <p className="text-gray-800">{comment.comment}</p>
                    <button
                      className="text-sm text-red-500"
                      onClick={() => deleteComment(comment._id)}
                    >
                      Delete
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center py-8">
                  No comments yet. Be the first!
                </p>
              )}
            </div>

            <form
              onSubmit={addComment}
              className="flex items-center gap-2 p-4 border-t border-gray-200 bg-white"
            >
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-400" required
              />
              <button
                type="submit"
                className="px-6 py-2 bg-sky-500 text-white rounded-full hover:bg-sky-600"
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

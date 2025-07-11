'use client'
import axios from "axios";
import { useState, FormEvent } from "react";
import Cookies from "js-cookie";

export type Comment = {
  _id: string;
  comment?: string;
  createdAt: string;
  user?: { name?: string };
};
type UserCommentsProps = {
  Pid: string;
  comments: Comment[];
};
function UserComments({ Pid, comments }: UserCommentsProps) {
  const token = Cookies.get('token');
  const [addcomments, setComments] = useState("");
  const [showModal, setShowModal] = useState(false);

  const addCommentsFn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/addChronicles/${Pid}/comments/`,{
        comment: addcomments
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        }
      });
      setComments(""); 
      console.log(response);
    } catch (error) {
      console.log(error, 'addComments');
    }
  };

  // Helper to format date safely
  const formatDate = (dateString: string) =>
    new Date(dateString).toISOString().slice(0, 10);

  // Show only the first comment by default
  const firstComment = comments?.[0];

  return (
    <>
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-white mb-2">User Comments</h3>
        <form
          onSubmit={addCommentsFn}
          className="flex items-center gap-2 mb-4 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl px-3 py-2 shadow"
        >
          <input
            type="text"
            placeholder="Add a comment"
            value={addcomments}
            onChange={(e) => setComments(e.target.value)}
            required
            className="flex-1 px-3 py-2 rounded-lg bg-white/70 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-400 to-violet-400 text-white font-semibold shadow hover:from-pink-500 hover:to-violet-500 transition"
          >
            Submit
          </button>
        </form>

        <div className="space-y-4">
          {(!comments || comments.length === 0) && (
            <div className="text-white/60 italic">No comments yet. Be the first!</div>
          )}
          {firstComment && (
            <div
              className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4 shadow flex flex-col"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-pink-300 font-medium">{firstComment.user?.name || "Anonymous"}</span>
                <span className="text-xs text-white/50">{formatDate(firstComment.createdAt)}</span>
              </div>
              <div className="text-white/90">{firstComment.comment}</div>
            </div>
          )}
          {comments.length > 1 && (
            <button
              onClick={() => setShowModal(true)}
              className="mt-2 text-pink-300 underline hover:text-pink-400 transition"
            >
              See more comments ({comments.length})
            </button>
          )}
        </div>
      </div>

      {/* Modal for all comments */}
      {showModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
    <div className="relative w-full max-w-md mx-auto bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-6">
      <button
        onClick={() => setShowModal(false)}
        className="absolute top-2 right-3 text-white text-xl font-bold hover:text-pink-400"
        aria-label="Close"
      >×</button>
      <h4 className="text-xl font-semibold text-white mb-4">All Comments</h4>
      <div className="max-h-80 overflow-y-auto space-y-4 pr-2">
        {comments.map((e) => (
          <div
            key={e._id}
            className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4 shadow flex flex-col"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-pink-300 font-medium">{e.user?.name || "Anonymous"}</span>
              <span className="text-xs text-white/50">{formatDate(e.createdAt)}</span>
            </div>
            <div className="text-white/90">{e.comment}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
)}

    </>
  );
}

export default UserComments;

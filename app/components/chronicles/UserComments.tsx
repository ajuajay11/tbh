'use client'
import axios from "axios";
import { useState, FormEvent } from "react";
import Cookies from "js-cookie";
import { User } from 'lucide-react';

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
  // const [showModal, setShowModal] = useState(false);

  const addCommentsFn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/addChronicles/${Pid}/comments/`, {
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

  return (
    <>
      <div className="mt-1 pt-1 ">
        <form onSubmit={addCommentsFn} className="flex space-x-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <input type="text" value={addcomments} onChange={(e) => setComments(e.target.value)} placeholder="Add a supportive message..." className="w-full bg-transparent border-none outline-none text-sm placeholder-gray-500 py-2" required />
          </div>
          <button className="text-blue-400 font-semibold text-sm hover:text-blue-300 transition-colors px-3 py-2"> Comment </button>
        </form>
         <div className="space-y-2 border-t border-gray-800 pt-4">
          {comments.slice(0, 2).map((comment) => (
            <div key={comment?._id} className="flex space-x-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-xs text-white font-semibold">
                  {comment.user?.name?.[0]?.toUpperCase() || 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start space-x-2">
                  <span className="font-semibold text-sm text-white">
                    {comment.user?.name || 'Anonymous'}
                  </span>
                  <span className="text-sm text-gray-300 flex-1">
                    {comment.comment}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for all comments */}
      {/* {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="relative w-full max-w-md mx-auto bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-6">
            <button onClick={() => setShowModal(false)} className="absolute top-2 right-3 text-white text-xl font-bold hover:text-pink-400" aria-label="Close" >×</button>
            <h4 className="text-xl font-semibold text-white mb-4">All Comments</h4>
            <div className="max-h-80 overflow-y-auto space-y-4 pr-2">
              {comments.map((e) => (
                <div key={e._id} className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl p-4 shadow flex flex-col" >
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
      )} */}

    </>
  );
}

export default UserComments;

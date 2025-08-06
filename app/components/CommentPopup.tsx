'use client';
import { useState, FormEvent,  } from "react";
import { MessageCircle, X, User } from 'lucide-react';
import axios from "axios";
import Cookies from "js-cookie";
import { createPortal } from "react-dom";

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

export default function CommentPopup({ Pid, comments }: UserCommentsProps) {
    const token = Cookies.get('token');
  const [addcomments, setComments] = useState("");
    const [isModelOpen, setIsModelOpen] = useState(false);
   const [allComments, setAllComments] = useState<Comment[]>(comments); // 👈 LOCAL STATE

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
      const newComment: Comment = {
        _id: response.data?.user?._id,
        comment: response.data?.user?.comment,
        createdAt: response.data?.user?.createdAt,
        user: { name: response.data?.user?.name },
      };

      // update comment list
      setAllComments((prev) => [...prev, newComment]);

    //  comments.push({ ...response?.user });
    } catch (error) {
      console.log(error, 'addComments');
    }
  };
    return (
        <>
            {/* Toggle Icon */}
            <div
                onClick={() => setIsModelOpen(!isModelOpen)}
                className="flex items-center space-x-2 p-2 hover:bg-gray-800 rounded-full transition-all group cursor-pointer"
            >
                <MessageCircle className="w-6 h-6 group-hover:text-blue-400 transition-colors" />
            </div>

            {/* Modal with Portal */}
            {isModelOpen &&
                createPortal(
                    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50">
                        <div
                            data-aos="fade-up"
                            className="w-full max-w-4xl h-[80vh] max-h-[80vh] bg-black rounded-t-lg flex flex-col"
                        >
                            {/* Header */}
                            <div className="flex justify-between items-center px-4 py-2 border-b border-gray-700">
                                <span className="text-white font-semibold">Comments</span>
                                <X
                                    onClick={() => setIsModelOpen(false)}
                                    className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-200 transition-colors"
                                />
                            </div>

                            {/* Scrollable Comment List */}
                            <div className="flex-1 overflow-y-auto px-4 py-10 space-y-4">
                                {allComments.map((comment, i) => (
                                    <div key={i} className="flex space-x-3">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                        <span className="text-xs text-white font-semibold">
                                            {comment.user?.name?.[0]?.toUpperCase() || 'A'}
                                        </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                        <div className="flex flex-col items-start space-x-2">
                                            <span className="font-semibold text-sm text-white">
                                            {comment.user?.name || 'Anonymous'}
                                            </span>
                                            <span className="text-sm text-gray-300 flex-1">
                                            {comment.comment} - {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : ''}
                                            </span>
                                        </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Fixed Input */}
                            <form onSubmit={addCommentsFn} className="flex space-x-3 my-4 px-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center flex-shrink-0">
                                    <User className="w-4 h-4" />
                                </div>
                                <div className="flex-1">
                                    <input type="text" value={addcomments} onChange={(e) => setComments(e.target.value)} placeholder="Add a supportive message..." className="w-full bg-transparent border-none outline-none text-sm placeholder-gray-500 py-2" required />
                                </div>
                                <button className="text-blue-400 font-semibold text-sm hover:text-blue-300 transition-colors px-3 py-2"> Comment </button>
                            </form>
                        </div>
                    </div>,
                    document.body // Append to body for modal effect
                )}
        </>
    );
}
"use client";

import { useState } from "react";

type Comment = {
  _id: string;
  comment?: string;
  createdAt: string;
  user?: { name?: string };
};

type UserCommentsProps = {
  posts: {
    _id: string;
    UserComments: Comment[];
  }[];
 };

export default function UserComments({ posts }: UserCommentsProps) {
  const [newComment, setNewComment] = useState("");
  const [activePostId, setActivePostId] = useState<string | null>(null);

  const handleSubmit = (postId: string) => {
    if (!newComment.trim()) return;
    // You can call your API here using fetch/axios with postId and newComment
    console.log("Submitting comment:", newComment, "for post:", postId);
    setNewComment("");
  };

  return (
    <div className="space-y-8 max-w-xl mx-auto mt-10">
      {posts.map((post) => (
        <div
          key={post._id}
          className="rounded-xl text-white"
        >
          <h4 className="text-lg font-bold mb-2">Comments</h4>

          {/* Input Field */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Add a comment..."
              value={activePostId === post._id ? newComment : ""}
              onChange={(e) => {
                setActivePostId(post._id);
                setNewComment(e.target.value);
              }}
              className="w-full p-2 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none"
            />
            <button
              onClick={() => handleSubmit(post._id)}
              className="mt-2 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
            >
              Post
            </button>
          </div>

          {/* Existing Comments */}
          <div className="space-y-3">
            {post.UserComments.length === 0 ? (
              <p className="text-white/60 text-sm">No comments yet.</p>
            ) : (
              post.UserComments.map((comment) => (
                <div key={comment._id} className="p-3 bg-white/5 rounded-md">
                  <p className="text-sm font-medium">
                    {comment.user?.name ?? "Anonymous"}
                  </p>
                  <p className="text-sm">{comment.comment}</p>
                  <p className="text-xs text-white/50">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

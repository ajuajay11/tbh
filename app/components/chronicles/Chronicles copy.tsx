'use client'; // Mark as client component for Framer Motion

 import { motion, AnimatePresence } from "framer-motion";
import UserComments from "./UserComments";
import Userlikes from "./Userlikes";
import { useState, useEffect } from "react";

type Comment = {
    _id: string;
    comment?: string;
    createdAt: string;
    user?: { name?: string };
};

type Like = {
    _id: string;
    like: boolean;
    createdAt: string;
    user?: { name?: string };
};

type Chronicle = {
    _id: string;
    yourStoryTitle: string;
    chroniclesOfYou: string;
    replyAllowed: boolean;
    comments: boolean;
    emailAllowed: boolean;
    createdAt: string;
    likeCount: number;
    UserLikes: Like[];
    UserComments: Comment[];
};

export default function Chronicles() {
    const [posts, setPosts] = useState<Chronicle[]>([]);

    useEffect(() => {
        async function fetchPosts() {
            const res = await fetch('http://localhost:3000/api/getAllChronicles');
            if (!res.ok) {
                throw new Error(`Failed to fetch: ${res.status}`);
            }
            const json = await res.json();
            setPosts(json.allChronicles || json.limitedChronicles);
        }
        fetchPosts();
    }, []);

    return (
        <section className="min-h-screen from-gray-900 via-black to-gray-800 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-4xl md:text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-12"
                >
                    Your Safe Haven
                </motion.h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {posts.map((item) => (
                            <motion.article
                                key={item._id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                whileHover={{ scale: 1.03, boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)" }}
                                className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700"
                            >
                                <div className="p-5">
                                    <motion.h2
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2, duration: 0.5 }}
                                        className="text-lg font-semibold text-white mb-2 line-clamp-2"
                                    >
                                        {item.yourStoryTitle}
                                    </motion.h2>
                                    <motion.p
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3, duration: 0.5 }}
                                        className="text-xs text-gray-400 mb-3"
                                    >
                                        {new Date(item.createdAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })}
                                    </motion.p>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4, duration: 0.5 }}
                                        className="bg-gray-900 rounded-md p-3 mb-4"
                                    >
                                        <p className="text-gray-300 text-sm line-clamp-3">
                                            {item.chroniclesOfYou}
                                        </p>
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.5 }}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Userlikes />
                                            <span className="text-xs text-gray-400">
                                                {item.likeCount}
                                            </span>
                                        </div>
                                        {item.comments && (
                                            <span className="text-xs text-gray-400">
                                                {item.UserComments.length}
                                            </span>
                                        )}
                                    </motion.div>
                                    {item.comments && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.6, duration: 0.5 }}
                                            className="mt-4 pt-3 border-t border-gray-700"
                                        >
                                            <UserComments posts={posts} />
                                        </motion.div>
                                    )}
                                </div>
                            </motion.article>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
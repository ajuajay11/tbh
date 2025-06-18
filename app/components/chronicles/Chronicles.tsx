import { cookies } from "next/headers";
import UserComment from "@/app/components/chronicles/UserComments";
import Userlikes from "./Userlikes";
 import { getBaseUrl } from "@/lib/getBaseUrl"; // adjust path as needed

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

export default async function Chronicles() {
     const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
  
    const res = await fetch(`${getBaseUrl()}/api/getAllChroniclesByID`, {
        headers,
        cache: 'no-store',
    });
    const json = await res.json();
    const posts: Chronicle[] = json.allChronicles || json.limitedChronicles;
  
    return (
        <section className="min-h-screen bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold text-center text-white mb-10 tracking-wide"> Share Your Story </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((item) => (
                        <article key={item._id} className="bg-gray-900 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                            <div className="p-5">
                                <h2 className="text-lg font-semibold text-white mb-2 line-clamp-2"> {item.yourStoryTitle} </h2>
                                <p className="text-xs text-gray-500 mb-3">
                                    {new Date(item.createdAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}
                                </p>
                                <div className="bg-gray-800 rounded-md p-3 mb-4">
                                    <p className="text-gray-300 text-sm line-clamp-3">
                                        {item.chroniclesOfYou}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                         {item.UserComments && (
                                    <div className="mt-4 pt-3 border-t border-gray-700">
                                         <Userlikes Pid={item._id} likeCount={item.likeCount} likes={item.UserLikes}/>
                                    </div>
                                )}
                                        <span className="text-xs text-gray-400">
                                            {item.likeCount}
                                        </span>
                                    </div>
                                    {item.comments && (
                                        <span className="text-xs text-gray-400">
                                            {item.UserComments.length}
                                        </span>
                                    )}
                                </div>
                                {item.UserComments && (
                                    <div className="mt-4 pt-3 border-t border-gray-700">
                                        <UserComment Pid={item._id} comments={item.UserComments} />
                                    </div>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
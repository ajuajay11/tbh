'use client'
import { Chronicle, User, UserLike, UserComment } from "@/app/types/chronicle";
import Likes from "@/app/chronicles/components/Likes";
import Styles from "@/app/chronicles/chronicle.module.css";
import { truncatedDesc } from "@/utils/truncatedText";
import { Share2 } from "lucide-react";
import Link from "next/link";
import Comments from "@/app/chronicles/components/Comments";
import Image from "next/image";
import ReportAProblem from "@/app/chronicles/components/ReportAProblem";
import { getTimeAgo } from "@/utils/timeAgo";
import img1 from "@/public/tbh.png";

interface ChronicleWithUser extends Chronicle {
  user: User;
  createdAt: string;
  UserLikes?: UserLike[];       // Array type!
  UserComments?: UserComment[];
}
interface ScrollReelsProps {
  chronicles: ChronicleWithUser[];
}

export default function ScrollReels({ chronicles }: ScrollReelsProps) {
  return (
    <>
      {chronicles && chronicles.length > 0 ? (
        <div className={Styles.reel_container}>
          {chronicles.map((item) => (
            <article key={item._id} className={Styles.reel_item}>
              <div className="relative w-full h-full flex justify-center items-center bg-[#fffff0] text-[#2d2d2d]">
                {/* Top Header Bar */}
                <div className="absolute w-full bg-gradient-to-b from-black/80 to-transparent left-0 top-0 flex items-center justify-between px-4 py-3 z-50">
                  {/* Left side - User info */}
                  <div className="flex items-center gap-3">
                    {/* Profile Image */}
                    <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#980000]">
                      <Image
                        src={img1}
                        alt="profile"
                        fill
                        className="object-cover bg-[#000]"
                      />
                    </div>

                    {/* Name and username */}
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold text-sm">
                          {item.user.firstname} {item.user.lastname}
                        </span>
                        {/* Verified badge */}
                        <svg
                          className="w-4 h-4 text-blue-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                        </svg>
                      </div>
                      <span className="text-gray-300 text-xs">
                        @{item.user.username}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-gray-300 text-xs hidden sm:block">
                      {getTimeAgo(item.createdAt)}
                    </span>

                    <div className="text-white hover:text-gray-300 transition-colors p-2">
                      <ReportAProblem Pid={item._id} />
                    </div>
                  </div>
                </div>

                {/* Story Content */}
                <Link
                  href={`/chronicles/${item._id}`}
                  className="max-w-[400px] w-full text-center px-4"
                >
                  <h2 className="font_two font-semibold mb-3">
                    {item.yourStoryTitle}
                  </h2>
                  <p className="whitespace-pre-line font_three leading-relaxed">
                    {truncatedDesc(item.chroniclesOfYou, 500)}
                  </p>
                  <div className="mt-4 text-gray-400 text-xs">
                    <p>
                      <strong>From:</strong> {item.incidentFrom}
                    </p>
                    <p>
                      <strong>By:</strong>{" "}
                      {item.user
                        ? `${item?.user?.firstname} ${item?.user?.lastname} (@${item?.user?.username})`
                        : "Anonymous"}
                    </p>
                  </div>
                </Link>

                 <div className="absolute right-3 bottom-16 flex flex-col items-center gap-3 text-white">
                <Likes Pid={item._id || ""} userLikesData={item.UserLikes || []} />
                  <div>
                    <Comments Pid={item._id || ""} userCommentsData={item.UserComments || []} />

                  </div>
                  <button className="flex flex-col items-center">
                    <Share2 className="w-6 h-6 text-[#333]" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 p-8">No chronicles available</p>
      )}
    </>
  );
}
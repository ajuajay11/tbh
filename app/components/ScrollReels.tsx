"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { Chronicle, User, UserLike, UserComment } from "@/app/types/chronicle";
import Styles from "@/app/chronicles/chronicle.module.css";
import Image from "next/image";
import Link from "next/link";
import Likes from "@/app/chronicles/components/Likes";
import Comments from "@/app/chronicles/components/Comments";
import ReportAProblem from "@/app/chronicles/components/ReportAProblem";
import ShareComp from "../chronicles/components/ShareComp";
import { getTimeAgo } from "@/utils/timeAgo";
import img1 from "@/public/tbh.png";
import { truncatedDesc } from "@/utils/truncatedText";

interface ChronicleWithUser extends Chronicle {
  user: User;
  createdAt: string;
  UserLikes?: UserLike[];
  UserComments?: UserComment[];
}

interface ScrollReelsProps {
  initialChronicles: ChronicleWithUser[];
}

export default function ScrollReels({ initialChronicles }: ScrollReelsProps) {
  const [chronicles, setChronicles] = useState(initialChronicles);
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [page, setPage] = useState(1);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(false);

  // FIX 2: Wrap loadNextPage in useCallback with proper dependencies
  const loadNextPage = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;
    
    loadingRef.current = true;
    setLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`/api/getAllChronicles?page=${page + 1}&limit=20`, {
        headers,
      });
      
      if (!res.ok) throw new Error("Failed to fetch next page");
      
      const result = await res.json();
      const newChronicles: ChronicleWithUser[] = result.data ?? [];
      
      if (newChronicles.length > 0) {
        setChronicles((prev) => [...prev, ...newChronicles]);
        setPage((prev) => prev + 1);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [page, hasMore]); // Include dependencies

  // FIX 1: Copy itemRefs.current to a variable inside the effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setVisibleIndex(index);
          }
        });
      },
      {
        root: null,
        threshold: 0.6,
      }
    );

    // Copy ref to local variable
    const currentRefs = itemRefs.current;

    currentRefs.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      // Use the copied variable in cleanup
      currentRefs.forEach((el) => {
        if (el) observer.unobserve(el);
      });
    };
  }, [chronicles.length]);

  // FIX 2: Include all dependencies
  useEffect(() => {
    if (visibleIndex >= chronicles.length - 2 && !loading && !loadingRef.current && hasMore) {
      loadNextPage();
    }
  }, [visibleIndex, chronicles.length, loading, hasMore, loadNextPage]);

  return (
    <>
      {initialChronicles && initialChronicles.length > 0 ? (
        <div className={Styles.reel_container}>
          {chronicles.map((item, index) => (
            <article
              key={item._id}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              data-index={index}
              className={Styles.reel_item}
            >
              <div className="relative w-full h-[96vh] md:h-full flex justify-center items-center bg-[#fffff0] text-[#2d2d2d]">
                <div className="absolute w-full bg-gradient-to-b from-black/80 to-transparent left-0 top-0 flex items-center justify-between px-4 py-3 z-50">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#980000]">
                      <Image
                        src={img1}
                        alt="profile"
                        fill
                        className="object-cover bg-[#000]"
                      />
                    </div>
                    <div className="flex flex-col">
                      <Link href={`/dashboard?user=${item?.user?.username}`} className="flex items-center gap-2">
                        <span className="text-white font-semibold text-sm">
                          {item?.user?.firstname} {item?.user?.lastname}
                        </span>
                        <svg
                          className="w-4 h-4 text-blue-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                        </svg>
                      </Link>
                      <span className="text-gray-300 text-xs">
                        @{item?.user?.username}
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

                <Link
                  href={`/chronicles/${item._id}`}
                  className="max-w-[400px] w-full text-center px-4"
                >
                  <h2 className="font_two font-semibold mb-3">
                    {item.yourStoryTitle}
                  </h2>
                  <p className="whitespace-pre-line font_three leading-relaxed">
                    {truncatedDesc(item.chroniclesOfYou, 300)}
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

                <div className="absolute right-3 bottom-16 flex flex-col items-center gap-1 text-white">
                  <div>
                    <Likes
                      Pid={item._id || ""}
                      userLikesData={item.UserLikes || []}
                    />
                  </div>
                  <div>
                    {item.comments && (
                      <Comments
                        Pid={item._id || ""}
                        userCommentsData={item.UserComments || []}
                      />
                    )}
                  </div>
                  <div>
                    <ShareComp
                      Pid={item._id || ""}
                      Title={item.yourStoryTitle || ""}
                    />
                  </div>
                </div>
              </div>
            </article>
          ))}
          {loading && <p>Loading more...</p>}
        </div>
      ) : (
        <section className="h-screen flex items-center justify-center flex-col">
          <p className="text-center text-gray-400 p-8">
            No chronicles available
          </p>
          <div className="text-center">
            <Link href="/dashboard/write-chronicle" className="tbh_button">
              start with you
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
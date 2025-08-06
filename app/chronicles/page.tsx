import { getBaseUrl } from "@/lib/getBaseUrl";
import { cookies } from "next/headers";
// import FilterChronicles from "@/app/components/chronicles/FilterChronicles";
import UserCommentsComponent from "@/app/components/chronicles/UserComments";
import Userlikes from "@/app/components/chronicles/Userlikes";
import ReportAProblem from "@/app/components/chronicles/ReportAProblem";
import { truncatedDesc, formatDate } from '@/utils/truncatedText'; // adjust path as needed
import LeftPanel from "@/app/components/chronicles/LeftPanel";
// import Link from "next/link";
import Image from "next/image";
import { Send, BookOpen, MapPin, Bookmark, } from 'lucide-react';
import CommentPopup from "@/app/components/CommentPopup"
type Chronicle = {
  _id: string,
  yourStoryTitle: string;
  chroniclesOfYou: string;
  incidentFrom: string;
  replyAllowed: boolean;
  comments: boolean;
  likeCount: number;
  emailAllowed: boolean;
  user: {
    _id: string;
    profilePicture: string;
    lastname: string;
    username: string;
    email: string;
    firstname: string;
  };
  createdAt: string;
  UserComments: {
    _id: string;
    comment: string;
    createdAt: string;
    user: {
      userId: string;
      name: string;
    };
  }[];

  UserLikes: {
    _id: string;
    like: boolean;
    createdAt: string;
    user: {
      userId: string;
      name: string;
    };
  }[];

};
type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
export default async function Chronicles({ searchParams }: PageProps) {
  // Await the searchParams promise
  const resolvedSearchParams = await searchParams;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const baseUrl = getBaseUrl();
  const query = {
    limit: typeof resolvedSearchParams.limit === "string" ? resolvedSearchParams.limit : "10",
    page: typeof resolvedSearchParams.page === "string" ? resolvedSearchParams.page : "1",
    sort: typeof resolvedSearchParams.sort === "string" ? resolvedSearchParams.sort : "",
    country: typeof resolvedSearchParams.country === "string" ? resolvedSearchParams.country : "",
    search: typeof resolvedSearchParams.search === "string" ? resolvedSearchParams.search : "",
  };

  const filteredQuery: Record<string, string> = {};

  for (const key in query) {
    const value = query[key as keyof typeof query];
    if (value !== "") {
      filteredQuery[key] = String(value);
    }
  }
  const queryString = new URLSearchParams(filteredQuery).toString();
  const res = await fetch(`${baseUrl}/api/getAllChronicles?${queryString}`, {
    headers,
    cache: 'no-store',
  });
  const json = await res.json();
  const data: Chronicle[] = json?.limitedChronicles || json?.data || [];
  console.log(data, 'data');


  return (
    <>
      <div className="h-screen w-full overflow-hidden flex justify-center">
        <div className="flex flex-col md:flex-row h-full w-full max-w-[1600px]">
          <div className="h-screen w-full text-white flex">
            <LeftPanel />
            <div className="flex-1 p-6 overflow-y-auto scrollYTBH " data-aos="fade-in">
              <div className="w-full max-w-7xl px-4">
                {/* {data?.length > 0 ? <FilterChronicles initialFilters={query} /> : null} */}
                {data?.length > 0 ? <div className="grid grid-cols-1 gap-8 mt-10">
                  {data?.map((chronicle) => (
                    <article key={chronicle._id} className="py-6">
                      <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center space-x-3">
                          <div>
                            {chronicle?.user?.profilePicture ? (
                              <Image width={40} height={40} className="rounded-full" src={chronicle?.user?.profilePicture} alt={chronicle?.user?.firstname} />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-500 flex items-center justify-center text-white font-semibold uppercase">
                                {(chronicle?.user?.firstname?.[0] || 'A')}
                                {(chronicle?.user?.lastname?.[0] || 'N')}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold text-white">
                                {chronicle?.user?.username ? (
                                  <span>{chronicle?.user?.username}</span>
                                ) : (
                                  <span className="text-gray-500">Anonymous</span>
                                )}
                              </h3>
                              <span className="text-gray-500 text-sm">•</span>
                              <span className="text-gray-500 text-sm">
                                {formatDate(chronicle?.createdAt)}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-gray-400 mt-1">
                              <MapPin className="w-3 h-3" />
                              <span>{chronicle.incidentFrom}</span>
                            </div>
                          </div>
                        </div>
                        <div className=" ">
                          <a
                            href={`/chronicles/s?id=${chronicle?._id}`}
                            className="group flex items-center space-x-2 px-3 py-2 rounded-full text-sm text-gray-300 bg-gray-900/50 hover:bg-gray-700 transition-all duration-300 ease-in-out transform hover:scale-105 hover:text-white relative overflow-hidden"
                          >
                            <span className="absolute inset-0 bg-blue-500/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-in-out"></span>
                            <BookOpen className="w-5 h-5 text-blue-400 group-hover:text-white transition-colors duration-300 ease-in-out" />
                            <span className="relative z-10">Read full story</span>
                          </a>
                        </div>

                      </div>

                      {/* Post Content */}
                      <div className="px-4 mb-4 py-10">
                        <h2 className="text-center merienda mb-3 text-white leading-tight">
                          {chronicle.yourStoryTitle}
                        </h2>
                        <div className="prose prose-invert max-w-none">
                          <p className="text-center merienda-small text-gray-300 leading-relaxed whitespace-pre-wrap">
                            {truncatedDesc(chronicle.chroniclesOfYou, 500)}
                          </p>
                        </div>

                        {/* Read More Link */}

                      </div>

                      {/* Post Actions */}
                      <div className="px-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-1">
                            <Userlikes Pid={chronicle?._id} likeCount={chronicle.likeCount} likes={chronicle?.UserLikes} />

                            {chronicle.replyAllowed && (
                              <CommentPopup Pid={chronicle?._id} comments={chronicle?.UserComments} />
                            )}
                            <div className="flex items-center space-x-2 hover:bg-gray-800 rounded-full transition-all group">
                              <div className="tooltip-container">
                                <div className="button-content">
                                  <Send className="w-6 h-6 p-1 group-hover:text-yellow-400 transition-colors" />
                                </div>
                                <div className="tooltip-content">
                                  <div className="social-icons">
                                    <a href="#" className="social-icon twitter">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                      >
                                        <path d="M20.52 3.48A11.88 11.88 0 0 0 12 0C5.37 0 .01 5.37.01 12c0 2.11.55 4.15 1.6 5.96L0 24l6.21-1.62A11.95 11.95 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 22a9.9 9.9 0 0 1-5.09-1.41l-.36-.22-3.69.97.98-3.6-.24-.37A9.94 9.94 0 0 1 2 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.33-7.61c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15s-.77.97-.94 1.17c-.17.2-.34.22-.63.07-.3-.15-1.27-.47-2.42-1.5a9.16 9.16 0 0 1-1.7-2.1c-.17-.3 0-.47.13-.62.13-.13.3-.34.45-.5.15-.17.2-.27.3-.47.1-.2.05-.37 0-.52-.07-.15-.67-1.61-.92-2.2-.24-.6-.5-.5-.67-.5h-.57c-.2 0-.52.07-.8.37s-1.05 1.02-1.05 2.47 1.08 2.87 1.23 3.07c.15.2 2.12 3.22 5.15 4.52.72.31 1.28.5 1.72.63.72.23 1.37.2 1.88.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.08-.12-.27-.2-.57-.35z" />
                                      </svg>
                                    </a>
                                    <a href="#" className="social-icon facebook">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        width="24"
                                        height="24"
                                      >
                                        <path
                                          d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                                        ></path>
                                      </svg>
                                    </a>
                                    <a href="#" className="social-icon linkedin">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        width="24"
                                        height="24"
                                      >
                                        <path
                                          d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                                        ></path>
                                      </svg>
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="p-2 hover:bg-gray-800 rounded-full transition-colors group">
                              <Bookmark className="w-5 h-5 group-hover:text-yellow-400 transition-colors" />
                            </div>

                            <ReportAProblem Pid={chronicle?._id} />
                            {/* <Flag className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors" /> */}

                          </div>
                        </div>

                        {/* Likes and Comments */}
                        <div className="space-y-3">
                          {chronicle.likeCount > 0 && (
                            <p className="font-semibold text-sm">
                              {chronicle.likeCount} {chronicle.likeCount === 1 ? 'person found this helpful' : 'people found this helpful'}
                            </p>
                          )}

                          {/* Add Comment */}
                          {chronicle.replyAllowed && (
                            <UserCommentsComponent Pid={chronicle?._id} comments={chronicle?.UserComments} />
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div> : <div className="text-center border py-14">OO**** Funde.. No Story Available</div>
                }
              </div>
            </div>
            {/* Right Panel */}
            <div className="w-1/5 p-4 pt-20 transform" style={{
              backgroundImage: `url('/girl.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.5,
            }}>
              {/* <h2 className="text-xl font-bold mb-4">Right Panel</h2>
              <div className="space-y-4">
                <div className="bg-zinc-700 p-3 rounded-lg">Notification</div>
                <div className="bg-zinc-700 p-3 rounded-lg">Profile</div>
                <div className="bg-zinc-700 p-3 rounded-lg">Updates</div>
              </div> */}
            </div>

          </div>

        </div></div>
    </>
  )
}

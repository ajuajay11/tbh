import { getBaseUrl } from "@/lib/getBaseUrl";
import { cookies } from "next/headers";
import UserCommentsComponent from "@/app/chronicles/components/UserComments";
import Userlikes from "@/app/chronicles/components/Userlikes";
import ReportAProblem from "@/app/chronicles/components/ReportAProblem";
import { truncatedDesc, formatDate } from '@/utils/truncatedText'; // adjust path as needed
import LeftPanel from "@/app/chronicles/components/LeftPanel";
import Image from "next/image";
import { Send, BookOpen, MapPin, Bookmark, } from 'lucide-react';
import CommentPopup from "../chronicles/components/CommentPopup"
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
      <div className="h-screen w-full overflow-hidden  ">
        <div className="flex flex-col md:flex-row h-full w-full max-w-[1600px]">
          <div className="h-screen w-full text-white flex">
            <LeftPanel />
            <div className="flex-1 lg:p-2 overflow-y-auto scrollYTBH">
              <div className="w-full max-w-7xl lg:px-4">
                {/* {data?.length > 0 ? <FilterChronicles initialFilters={query} /> : null} */}
                {data?.length > 0 ? <div className="grid grid-cols-1 gap-3 ">
                  {data?.map((chronicle) => (
                    <article key={chronicle._id} className="flex flex-col justify-between rounded-2xl shadow-lg overflow-hidden" style={{height:"90vh"}}>
                      <header className="flex items-center justify-between p-4  ">
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
                               <span className="text-gray-500 text-sm font_five">
                                {formatDate(chronicle?.createdAt)}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-gray-400 mt-1">
                              <MapPin className="w-3 h-3" />
                              <span>{chronicle.incidentFrom}</span>
                            </div>
                          </div>
                        </div>
                        <div >
                          <a href={`/chronicles/s?id=${chronicle?._id}`} className="group flex items-center space-x-2 px-3 py-2 rounded-full text-sm text-gray-300 bg-gray-900/50 hover:bg-gray-700 transition-all duration-300 ease-in-out transform hover:scale-105 hover:text-white relative overflow-hidden" >
                            <span className="absolute inset-0 bg-blue-500/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-in-out"></span>
                            <BookOpen className="w-5 h-5 text-blue-400 group-hover:text-white transition-colors duration-300 ease-in-out" />
                            <span className="relative z-10 hidden lg:block">Read full story</span>
                          </a>
                        </div>
                      </header>
                      {/* Post Content */}
                      <div className="flex-1 px-4 flex flex-col justify-center lg:py-3" style={{background: 'cornsilk'}}>
                        <h2 className="text-center eb-garamond text-[#000] pt-5 fw-bold leading-tight font_seven">
                          {chronicle?.yourStoryTitle}
                        </h2>
                        <div className="prose prose-invert max-w-none pt-2 lg:pt-5">
                          <p className="text-center eb-garamond font_six text-gray-900 leading-relaxed whitespace-pre-wrap px-0 lg:px-20 pb-5">
                            {truncatedDesc(chronicle?.chroniclesOfYou,410)}
                          </p>
                        </div>

                        {/* Read More Link */}

                      </div>

                      {/* Post Actions */}
                      <footer className="p-2 space-y-3">
                        <div className="flex items-center justify-between ">
                          <div className="flex items-center space-x-1">
                            <Userlikes Pid={chronicle?._id} likeCount={chronicle?.likeCount} likes={chronicle?.UserLikes} />
                            {chronicle.replyAllowed && ( <CommentPopup Pid={chronicle?._id} comments={chronicle?.UserComments} /> )}
                            <div className="flex items-center space-x-2 hover:bg-gray-800 rounded-full transition-all group">
                              <div className="tooltip-container">
                                <div className="button-content">
                                  <Send className="w-6 h-6 p-1 group-hover:text-yellow-400 transition-colors" />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="p-2 hover:bg-gray-800 rounded-full transition-colors group">
                              <Bookmark className="w-5 h-5 group-hover:text-yellow-400 transition-colors" />
                            </div>
                            <ReportAProblem Pid={chronicle?._id} />
                          </div>
                        </div>

                        {/* Likes and Comments */}
                        <div className="space-y-3">
                          {/* {chronicle.likeCount > 0 && ( <p className="font-semibold text-sm"> {chronicle.likeCount} {chronicle.likeCount === 1 ? 'person found this helpful' : 'people found this helpful'} </p> )} */}
                          {/* Add Comment */}
                          {chronicle.replyAllowed && (
                            <UserCommentsComponent Pid={chronicle?._id} comments={chronicle?.UserComments} />
                          )}
                        </div>
                      </footer>
                    </article>
                  ))}
                </div> : <div className="text-center border py-14">OO**** Funde.. No Story Available</div>
                }
              </div>
            </div>
            {/* Right Panel */}
            {/* <div className="hidden lg:block w-1/5 p-4 pt-20 transform" style={{ backgroundImage: `url('/girl.png')`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.5 }}> */}
            <div className="hidden lg:block w-1/5 p-4 pt-20 transform"  >
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

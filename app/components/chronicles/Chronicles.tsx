import { getBaseUrl } from "@/lib/getBaseUrl";
 import UserCommentsComponent from "@/app/components/chronicles/UserComments";
import Userlikes from "@/app/components/chronicles/Userlikes";
import ReportAProblem from "@/app/components/chronicles/ReportAProblem";
import ShowMore from "./ShowMore"
type Chronicle = {
  _id: string;
  yourStoryTitle: string;
  chroniclesOfYou: string;
  incidentFrom: string;
  replyAllowed: boolean;
  comments: boolean;
  likeCount: number;
  emailAllowed: boolean;
  user: string;
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

export default async function Chronicles() {
  const baseUrl = getBaseUrl();

  const res = await fetch(`${baseUrl}/api/getAllChronicles`, {
    cache: "no-store",
  });

  const json = await res.json();
  const data: Chronicle[] = json.limitedChronicles || json.data || [];

  return (
     <section className="min-h-screen bg-gradient-to-br from-[#22223b] via-[#4a4e69] to-[#9a8c98] flex flex-col items-center py-10">
        <div className="w-full max-w-7xl px-4">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-white drop-shadow">Chronicles Gallery</h1>
          <p className="text-white/70 mt-2">Discover real stories from around the world</p>
        </div>

        {data.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
              {data.map((chronicle) => (
                <div
                  key={chronicle._id}
                  className="backdrop-blur-lg bg-black/20 border border-white/20 rounded-3xl shadow-xl p-6 flex flex-col justify-between transition hover:scale-105 hover:shadow-2xl"
                >
                  <div>
                    <h2 className="text-2xl font-semibold text-white mb-2">{chronicle.yourStoryTitle}</h2>
                    <p className="text-white/80 mb-4">{chronicle.chroniclesOfYou}</p>
                    <div className="flex items-center justify-between text-sm text-white/70 mb-2">
                      <span className="px-2 py-1 bg-white/20 rounded-full">{chronicle.incidentFrom}</span>
                      <span className="px-2 py-1 bg-white/20 rounded-full">
                        {new Date(chronicle.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-2">
                    <ReportAProblem Pid={chronicle._id} />
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <span className="flex items-center gap-1 text-pink-300 font-bold">
                      <Userlikes Pid={chronicle._id} likeCount={chronicle.likeCount} likes={chronicle.UserLikes} />
                    </span>
                    <span className="flex items-center gap-1 text-blue-200">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M17 8h2a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V10a2 2 0 012-2h2"></path>
                        <path d="M15 3h-6a2 2 0 00-2 2v3a2 2 0 002 2h6a2 2 0 002-2V5a2 2 0 00-2-2z"></path>
                      </svg>
                      {chronicle.UserComments?.length ?? 0}
                    </span>
                    <span className="flex items-center gap-1 text-green-200">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                      {chronicle.replyAllowed ? "Replies Allowed" : "No Replies"}
                    </span>
                  </div>

                  <UserCommentsComponent Pid={chronicle._id} comments={chronicle.UserComments} />
                </div>
              ))}
            </div>
            <div className="mt-20 text-center">
              <ShowMore/>
            </div>
          </>
        ) : (
          <div className="text-center border py-14 text-white/80 text-lg">Oombada Funde... No Story Available</div>
        )}
      </div>

    </section>
  );
}

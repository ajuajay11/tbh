import { Chronicle } from "../types/chronicle";
import "./chronicle.module.css";
import Comments from "./components/Comments";
import Likes from "./components/Likes";
import { getBaseUrl } from "@/lib/getBaseUrl";
import { cookies } from "next/headers";
import Styles from "./chronicle.module.css";
import { truncatedDesc  } from '@/utils/truncatedText'; // adjust path as needed
import { MessageCircle, Share2 } from "lucide-react";

export default async function Chronicles() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const headers: HeadersInit = token
    ? { Authorization: `Bearer ${token}` }
    : {};
  const res = await fetch(`${getBaseUrl()}/api/getAllChronicles`, {
    cache: "no-store",
    headers,
  });
  if (!res.ok) {
    throw new Error("Failed to fetch chronicles");
  }
  const result = await res.json();
  console.log(result);

  // ✅ Use `data` if token exists, otherwise `limitedChronicles`
  const chronicles: Chronicle[] = token
    ? result.data ?? []
    : result.limitedChronicles ?? [];
  return (
   <div className="p-0">
  {chronicles && chronicles.length > 0 ? (
    <div className={Styles.reel_container}>
      {chronicles.map((item) => (
        <div key={item._id} className={Styles.reel_item}>
          <div className="relative w-full h-full flex justify-center items-center bg-[#fffff0] text-[#2d2d2d]">
            {/* Story Content */}
            <div className="max-w-[400px] w-full text-center px-4 ">
              <h2 className="text-2xl font-semibold mb-3">
                {item.yourStoryTitle}
              </h2>
              <p className="whitespace-pre-line text-sm leading-relaxed">
                {truncatedDesc(item.chroniclesOfYou, 500)}
              </p>
              <div className="mt-4 text-gray-400 text-xs">
                <p>
                  <strong>From:</strong> {item.incidentFrom}
                </p>
                <p>
                  <strong>By:</strong>{" "}
                  {item.user
                    ? `${item.user.firstname} ${item.user.lastname} (@${item.user.username})`
                    : "Anonymous"}
                </p>
              </div>
            </div>

            {/* Right Side Action Bar */}
            <div className="absolute right-4 bottom-24 flex flex-col items-center gap-5 text-white">
              <Likes Pid={item._id || ""} userLikesData={item.UserLikes} />

              <button className="flex flex-col items-center">
                <MessageCircle className="w-6 h-6" />
                <span className="text-xs mt-1">
                  {item.UserComments?.length || 0}
                </span>
              </button>

              <button className="flex flex-col items-center">
                <Share2 className="w-6 h-6" />
              </button>
            </div>

            {/* Comments Section (optional, hidden until expanded) */}
            {/* <div className="absolute bottom-0 left-0 w-full">
              <Comments
                Pid={item._id || ""}
                userCommentsData={item.UserComments || []}
              />
            </div> */}
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p>hei</p>
  )}
</div>

  );
}

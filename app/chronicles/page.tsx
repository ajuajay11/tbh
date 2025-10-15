import { Chronicle } from "../types/chronicle";
import "./chronicle.module.css";
import Comments from "./components/Comments";
import Likes from "./components/Likes";
import { getBaseUrl } from "@/lib/getBaseUrl";
import { cookies } from "next/headers";
import Styles from "./chronicle.module.css";
import { truncatedDesc  } from '@/utils/truncatedText'; // adjust path as needed

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
    <div className="p-2">
      <h1 className="text-2xl font-bold mb-4 text-center">Chronicles</h1>
      
      {chronicles && chronicles.length > 0 ? (
        <div className={`${Styles.reel_container}`}>
          {chronicles.map((item) => (
            <div
              key={item._id}
              className={`${Styles.reel_item} p-4 rounded-xl shadow-md border bg-white`}
            >
              {/* Story Title */}
              <h2 className="text-xl font-semibold">{item.yourStoryTitle}</h2>
              <p className="mt-2 text-gray-700 whitespace-pre-line">
                {truncatedDesc(item.chroniclesOfYou, 30)}
              </p>

              {/* Extra Info */}
              <div className="text-sm text-gray-500">
                <p>
                  <strong>From:</strong> {item.incidentFrom}
                </p>
                <p>
                  <strong>By:</strong>{" "}
                  {item.user
                    ? `${item.user.firstname} ${item.user.lastname} (@${item.user.username})`
                    : "Anonymous"}
                </p>
                <p>
                  <strong>Likes:</strong> {item.likeCount || 0}
                </p>
                <p>
                  <strong>Comments:</strong>{" "}
                  {item.UserComments ? item.UserComments.length : 0}
                </p>
              </div>
              {<Comments Pid={item._id || ""} userCommentsData={item.UserComments || []} />}
              {
                <Likes
                  Pid={item._id || ""}
                  userLikesData={item.UserLikes}
                />
              }
            </div>
          ))}
        </div>
      ) : (
        <p>hei</p>
      )}
    </div>
  );
}

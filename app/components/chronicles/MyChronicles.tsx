import { cookies } from "next/headers";
// import CreateChronicles from "@/app/components/chronicles/CreateChronicles/index"
import { getBaseUrl } from "@/lib/getBaseUrl";
type Chronicle = {
  _id: string;
  yourStoryTitle: string;
  chroniclesOfYou: string;
  replyAllowed: boolean;
  comments: boolean;
  emailAllowed: boolean;
  createdAt: string;
  likeCount: number;
};

export default async function page() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  const res = await fetch(`${getBaseUrl()}/api/getChroniclesByID`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  const json = await res.json();
  const posts: Chronicle[] = json.allChronicles || json.limitedChronicles;
  return (
    <>
      <div className="grid grid-cols-3 mt-40">
        {posts.map((item: Chronicle) => (
          <div
            key={item._id}
            className="p-4 text-[10px] leading-tight h-28 overflow-hidden shadow-sm"
          >
            <p className="font-semibold truncate mb-4">{item.yourStoryTitle}</p>
            <p className="text-gray-600 line-clamp-2">{item.chroniclesOfYou}</p>
            <div className="mt-1 text-gray-400 text-[9px] mt-5">
              ❤️ {item?.likeCount} likes
            </div>
          </div>
        ))}
      </div>

    </>
  )
}
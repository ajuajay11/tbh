import { truncatedDesc  } from '@/utils/truncatedText'; // adjust path as needed
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
      <div className="grid grid-cols-3">
        {posts.map((item: Chronicle) => (
          <div key={item._id} className="p-5 text-[10px] leading-tight border border-[#111111]" >
            <h2 className="font_one mb-4 text-center capitalize">{truncatedDesc(item.yourStoryTitle, 15)}</h2>
            <p className="text-gray-600 font_three">{truncatedDesc(item.chroniclesOfYou, 250)}</p>
             
          </div>
        ))}
      </div>

    </>
  )
}
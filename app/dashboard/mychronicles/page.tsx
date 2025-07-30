import { cookies } from "next/headers";
import CreateChronicles from "@/app/components/chronicles/CreateChronicles/index"
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
            <div className="text-end mb-20">
                <CreateChronicles />
            </div>
           
            {posts.map((item) => (
                <div className="card p-4 border mt-3" key={item._id}>
                    {item.yourStoryTitle}
                    {item.chroniclesOfYou}
                </div>
            ))}
        </>
    )
}
import { Chronicle, User, UserLike, UserComment } from "../types/chronicle";

 import { getBaseUrl } from "@/lib/getBaseUrl";
import { cookies } from "next/headers";
 import ScrollReels from "@/app/components/ScrollReels"
// ✅ Fixed interface
interface ChronicleWithUser extends Chronicle {
  user: User;
  createdAt: string;
  userLikesData?: UserLike[];
  UserComments?: UserComment[];
}

export default async function Chronicles() {
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;
  const headers: HeadersInit = token
    ? { Authorization: `Bearer ${token}` }
    : {};
  const res = await fetch(`${getBaseUrl()}/api/getAllChronicles?page=1&limit=20?search=neymarjr1645`, {
    cache: "no-store",
    headers,
  });
  if (!res.ok) {
    throw new Error("Failed to fetch chronicles");
  }
  const result = await res.json();
  console.log(result);
  const chronicles: ChronicleWithUser[] = token
    ? result.data ?? []
    : result.limitedChronicles ?? [];
    
  return (
    <div className="p-0">
     <ScrollReels initialChronicles ={chronicles}/>
    </div>
  );
}
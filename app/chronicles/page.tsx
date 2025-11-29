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
export const metadata = {
  title: "Chronicles | Explore Anonymous Stories",
  description:
    "Browse real anonymous stories shared by people around the world. Scroll through Chronicles and discover thoughts, emotions, confessions, and experiences.",
  keywords: [
    "chronicles",
    "anonymous stories",
    "real stories",
    "confessions",
    "scroll reels",
    "anonymous platform",
  ],
  robots: "index, follow",
  openGraph: {
    title: "Chronicles | Explore Anonymous Stories",
    description:
      "Scroll through powerful anonymous stories and experiences shared on Chronicles.",
    url: "https://yourdomain.com/chronicles",
    siteName: "Chronicles",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chronicles | Explore Anonymous Stories",
    description:
      "Discover real anonymous stories shared by users on Chronicles.",
  },
};
export default async function Chronicles() {
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;
  const headers: HeadersInit = token
    ? { Authorization: `Bearer ${token}` }
    : {};
  const res = await fetch(`${getBaseUrl()}/api/getAllChronicles?page=1&limit=20`, {
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
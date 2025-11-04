// app/user/page.tsx
import AuthorHome from "./components/AuthorHome";
import "./author.module.css"
import { getBaseUrl } from "@/lib/getBaseUrl";
import { cookies } from "next/headers";
import { Chronicle, User } from "../types/chronicle";
import { UserProvider } from "./components/useContext";

export default async function UserPage({ searchParams }: { searchParams: Promise<{ u?: string }> }) {
  const params = await searchParams;
  const username = params.u;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  
  if (!username) {
    return <div className="h-screen flex justify-center items-center">No user specified</div>;
  }
  
  const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
  
  const res = await fetch(
    `${getBaseUrl()}/api/getChroniclesByID?username=${username}`, 
    {
      cache: "no-store",
      headers,
    }
  );
  const userRes = await fetch(
    `${getBaseUrl()}/api/user`, 
    {
      cache: "no-store",
      headers,
    }
  );
  if (!res.ok || !userRes.ok) {
    throw new Error("Failed to fetch chronicles");
  }
  
   const result = await res.json();
   
  const chronicles: Chronicle[] = result.data ?? [];
  const userData: User = result.user ?? {};
  
   
  return (
    <UserProvider chronicles={chronicles} userData={userData}>
      <AuthorHome />
    </UserProvider>
  );
}
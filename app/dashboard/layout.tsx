// app/dashboard/layout.tsx
import { getBaseUrl } from "@/lib/getBaseUrl";
import { cookies } from "next/headers";
import { Chronicle, User } from "../types/chronicle";
import { UserProvider } from "./components/useContext";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
  const urlParams = new URLSearchParams(window.location.search);
  console.log(urlParams);
 return null;
  const res = await fetch(`${getBaseUrl()}/api/getChroniclesByID?username=${user}`, {
    cache: "no-store",
    headers,
  });
  const userRes = await fetch(`${getBaseUrl()}/api/user`, {
    cache: "no-store",
    headers,
  });
  
  if (!res.ok || !userRes.ok) {
    throw new Error("Failed to fetch chronicles");
  }
  
  const userResult = await userRes.json();
  const result = await res.json();
  
  const chronicles: Chronicle[] = result.data ?? [];
  const userData: User = userResult.getUser ?? {};
  console.log(result,'userData');
  
  return (
    <UserProvider chronicles={chronicles} userData={userData}>
      {children}
    </UserProvider>
  );
}
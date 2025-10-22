// app/chronicles/[id]/page.tsx

import { getBaseUrl } from "@/lib/getBaseUrl";
import { cookies } from "next/headers";
import Diary from "../components/Diary";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/getAllChronicles?id=${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const data = await res.json();
  console.log("Server:", data);

  if (!res.ok || !data || !data.data?.length) {
    return <div>Post not found {id}</div>;
  }

  // ✅ Get the first post (specific chronicle)
  const chronicleDiary = data.data[0];

  return (
    <>
      <Diary chronicle={chronicleDiary} />
    </>
  );
}

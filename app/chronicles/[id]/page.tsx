// import { Chronicle } from "@/app/types/chronicle";
import { getBaseUrl } from "@/lib/getBaseUrl";
import { cookies } from "next/headers";
import Diary from "../components/Diary";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
export default async function page({ searchParams }: PageProps) {
   const params = await searchParams;

    const { id } = params;

    const cookieStore = await cookies();
      const token = cookieStore.get("token")?.value;
     
 
  const baseUrl = getBaseUrl();

  const res = await fetch(`${baseUrl}/api/getAllChronicles?id=${id}`, { cache: "no-store" });
  if (!res.ok) {
    return <div>Chronicle not found</div>;
  }

  const jsonData = await res.json();
  const chronicleDiary = jsonData.limitedChronicles?.[0] || jsonData.data?.[0];
  console.log(chronicleDiary);
 
  if (!chronicleDiary) {
    return <div>No chronicle found</div>;
  }

  return (
    <>
    <Diary chronicle={chronicleDiary}/>
    
    </>
  );
}

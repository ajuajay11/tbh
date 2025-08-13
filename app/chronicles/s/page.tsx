import Diary from "@/app/components/chronicles/Diary";
import { getBaseUrl } from "@/lib/getBaseUrl";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Chronicles({ searchParams }: PageProps) {
  const params = await searchParams;
  const id = params.id;
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
    <Diary chronicle={chronicleDiary}/>
  );
}

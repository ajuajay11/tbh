import Diary from "@/app/components/chronicles/Diary"
type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Chronicles({ searchParams }: PageProps) {
  const params = await searchParams;
  const id = params.id;

  const res = await fetch(
    `http://localhost:3000/api/getAllChronicles?id=${id}`,
    { cache: "no-store" }
  );

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

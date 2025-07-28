interface PageProps {
  params: {
    id: string;
  };
//   searchParams?: Record<string, string>;
}

export default async  function Page({ params }: PageProps) {
    const res =await  fetch(`http://localhost:3000/getAllChronicles/${params.id}`,{cache: "no-store"});
      const data = await res.json();

    console.log(data);
    
  return (
    <div>
      Chronicle ID: <strong>{params.id}</strong>
    </div>
  );
}

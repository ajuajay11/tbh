import { getBaseUrl } from "@/lib/getBaseUrl";
import { cookies } from "next/headers";
import FilterChronicles from "@/app/components/chronicles/FilterChronicles";
import UserCommentsComponent from "@/app/components/chronicles/UserComments";
import Userlikes from "@/app/components/chronicles/Userlikes";

type Chronicle = {
  _id: string,
  yourStoryTitle: string;
  chroniclesOfYou: string;
  incidentFrom: string;
  replyAllowed: boolean;
  comments: boolean;
  likeCount: number;
  emailAllowed: boolean;
  user: string;
  createdAt: string; 
  UserComments: {
    _id: string;
    comment: string;
    createdAt: string;
    user: {
      userId: string;
      name: string;
    };
  }[];
  UserLikes: {
    _id: string;
    like: boolean;
    createdAt: string;
    user: {
      userId: string;
      name: string;
    };
  }[];
};
type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
export default async function Chronicles({ searchParams }: PageProps) {
   // Await the searchParams promise
  const resolvedSearchParams = await searchParams;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const baseUrl = getBaseUrl();
  const query = {
    limit: typeof resolvedSearchParams.limit === "string" ? resolvedSearchParams.limit : "10",
    page: typeof resolvedSearchParams.page === "string" ? resolvedSearchParams.page : "1",
    sort: typeof resolvedSearchParams.sort === "string" ? resolvedSearchParams.sort : "",
    country: typeof resolvedSearchParams.country === "string" ? resolvedSearchParams.country : "",
    search: typeof resolvedSearchParams.search === "string" ? resolvedSearchParams.search : "",
  };
 
const filteredQuery: Record<string, string> = {};

for (const key in query) {
  const value = query[key as keyof typeof query];
  if (value !== "") {
    filteredQuery[key] = String(value);
  }
}
  const queryString = new URLSearchParams(filteredQuery).toString();

  const res = await fetch(`${baseUrl}/api/getAllChronicles?${queryString}`,{
        headers,
        cache: 'no-store',
    });
  const json = await res.json();
  console.log(json);
const data: Chronicle[] = json.limitedChronicles || json.data || [];
console.log(data,'datadatadata');

  return (
    <>
      <section className="text-white">
        <h1>This is my Fucking Game</h1>
        <p>Oh my gad</p>
        <FilterChronicles initialFilters={query}/>
        <ul>
          {data.map((chronicle) => (
            <li key={chronicle._id}>
              <h2>{chronicle.yourStoryTitle}</h2>
              <UserCommentsComponent Pid={chronicle._id} comments={chronicle.UserComments}/>
              <div></div>
                <Userlikes Pid={chronicle._id} likeCount={chronicle.likeCount} likes={chronicle.UserLikes}/>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}

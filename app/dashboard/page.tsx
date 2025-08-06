import { getBaseUrl } from "@/lib/getBaseUrl";
import { cookies } from "next/headers";
import Image from "next/image";
import MyChronicles from "@/app/components/chronicles/MyChronicles";

interface User {
  email: string;
  firstname: string;
  lastname: string;
  gender: string;
  age: number;
  username: string;
  profilePicture?: string;
}

export default async function Page() {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const cookieStore = cookies();
  const baseUrl = getBaseUrl();

  const token = cookieStore.get('token')?.value;
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${baseUrl}/api/user`, {
    headers,
    cache: 'no-store',
  });

  const json = await res.json();
  const user: User = json?.getUser;

  return (
    <main className="max-w-4xl mx-auto pt-49">
      {/* 👤 Profile Section */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 relative rounded-full overflow-hidden border">
          {user?.profilePicture ? (
            <Image
              src={user.profilePicture}
              alt="Profile Picture"
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center text-white text-xs">
              {user.firstname[0]}{user.lastname[0]}
            </div>
          )}
        </div>
        <div>
          <h2 className="text-lg font-semibold">{user.firstname} {user.lastname}</h2>
          <p className="text-sm text-gray-500">@{user.username}</p>
        </div>
      </div>

      {/* 📝 My Chronicles Section */}
      <section>
        <h3 className="text-xl font-bold mb-4">My Chronicles</h3>
        <MyChronicles />
      </section>
    </main>
  );
}

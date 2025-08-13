import Image from 'next/image';
import { cookies } from 'next/headers';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
export default async function LeftPanel() {
  const cookieStore = await cookies();
  const avatar = cookieStore.get('avatar')?.value;

  return (
    <>
      {/* Desktop Sidebar */}
      <section
        className="relative w-1/5 min-h-screen pt-24 p-6 hidden lg:flex flex-col items-center justify-start"
        data-aos="fade-left"
      >
        {avatar && (
          <Image
            src={avatar}
            alt="User avatar"
            width={140}
            height={140}
            className="rounded-full border-4 border-white shadow-xl"
          />
        )}

        <button
          className="mt-12 w-full bg-gradient-to-r from-blue-600 to-purple-600 
                     hover:from-blue-700 hover:to-purple-700 text-white font-bold 
                     py-5 px-8 rounded-3xl transition-all duration-300 transform 
                     hover:scale-[1.05] hover:shadow-2xl flex items-center justify-center 
                     gap-3 text-xl"
        >
          <PlusCircle size={26} strokeWidth={2.5} />
          Create Chronicle
        </button>
      </section>

      {/* Mobile Bottom Bar */}
     <div className="fixed bottom-6 left-1/2 -translate-x-1/2 lg:hidden">
  <Link
        href="/dashboard/add-chronicle"
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-xl 
                   hover:scale-110 transition-transform duration-300 animate-bounce-slow flex items-center justify-center"
      >
        <PlusCircle size={30} strokeWidth={2.5} />
      </Link>
 
</div>

    </>
  );
}

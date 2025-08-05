import { cookies } from 'next/headers';
import Link from 'next/link';
import DropDown from './DropDown';
 export default async function Index() {
  const cookieStore = await cookies();
  const isAuth = cookieStore.get('isAuthenticated')?.value;
 
  return (
    <>
      <div className="w-full z-50">
        <header className="absolute w-full z-50 bg-black/20 backdrop-blur-sm shadow-lg">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between z-50 ">
            {/* LOGO */}
            <Link href="/" className="flex items-center">
              <span className="text-white text-2xl font-bold tracking-wide px-4 py-1 rounded-lg bg-white/10 backdrop-blur-md shadow">TBH</span>
            </Link>

            {/* MIDDLE LINK — center nav (optional) */}
            <div className="hidden md:flex flex-1 justify-center">
              {/* Example: Add links here */}
              {/* <Link href="/getAllChronicles" className="text-white/90 hover:text-pink-300 text-lg font-semibold transition px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md shadow">Get All Chronicles</Link> */}
            </div>

            {/* AUTH ACTION */}
            <div className="flex items-center gap-2">
              {isAuth === 'true' ? (
                // <Link href="/dashboard" className="px-5 py-2 rounded-lg  text-white font-semibold shadow transition hover:bg-red-900"></Link>
                  <DropDown />
              ) : (
                <Link href="/login" className="tbh_button">
                  Login
                </Link>
              )}
            </div>
          </nav>

          {/* Mobile version */}
          {/* <div className="md:hidden flex justify-center pb-2">
            <Link href="/chronicles" className="text-white/90 hover:text-pink-300 text-lg font-semibold transition px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md shadow">
              Get All Chronicles
            </Link>
          </div> */}
        </header>
      </div>

    </>
  );
}

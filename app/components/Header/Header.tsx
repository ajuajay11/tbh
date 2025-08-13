import { cookies } from 'next/headers';
import Link from 'next/link';
import DropDown from './DropDown';
 
export default async function Index() {
  const cookieStore = await cookies();
  const isAuth = cookieStore.get('token')?.value;

  return (
    <>
      <div className="w-full z-50 ">
        <header className="absolute w-full z-50 bg-black/20 shadow-lg">
          <nav className="max-w-7xl mx-auto px-4 py-2 lg:py-2 flex items-center justify-between z-50 ">
            {/* LOGO */}
            <Link href="/" className=" ">
 
           <div className="flex items-center gap-2">
  {/* Evil Eye */}
  <div className="relative w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
    {/* White ring */}
    <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
      {/* Light blue iris */}
      <div className="w-3 h-3 rounded-full bg-blue-300 flex items-center justify-center">
        {/* Black pupil */}
        <div className="w-1.5 h-1.5 rounded-full bg-black"></div>
      </div>
    </div>
  </div>

  {/* TBH text with matching gradient */}
  <h1 className="text-3xl font-extrabold tracking-wide bg-gradient-to-r from-blue-500 via-blue-300 to-purple-500 bg-clip-text text-transparent">
    TBH
  </h1>
</div>
             </Link>

            {/* MIDDLE LINK — center nav (optional) */}
            <div className="hidden md:flex flex-1 justify-center">
              {/* Example: Add links here */}
              {/* <Link href="/getAllChronicles" className="text-white/90 hover:text-pink-300 text-lg font-semibold transition px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md shadow">Get All Chronicles</Link> */}
            </div>
            {/* AUTH ACTION */}
            <div className="flex items-center gap-2">
              {isAuth == 'true' ? (
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

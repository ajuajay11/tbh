import { cookies } from 'next/headers';
import Link from 'next/link';

export default async function Index() {
  const cookieStore = await cookies();
  const isAuth = cookieStore.get('isAuthenticated')?.value;

  return (
    <>
      <div className="w-full p-0">
        <div className="flex">
          <div className="w-1/3"></div>
          <div className="w-2/3" style={{position:'relative'}}>
            <header style={{ position: 'absolute', top: "0px", left: "0px" }} className="w-full">
              <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* <Link href="/" className="flex items-center">
                    <span className="text-white text-2xl font-bold tracking-wide px-4 py-1 rounded-lg bg-white/10 backdrop-blur-md shadow">TBH</span>
                  </Link> */}
                   <Link href="/getAllChronicles" className="text-white/90 hover:text-pink-300 text-lg font-semibold transition px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md shadow" >
                    Chronicles
                  </Link>
                </div>
                {/* <div className="hidden md:flex flex-1 justify-center">
                  <Link href="/getAllChronicles" className="text-white/90 hover:text-pink-300 text-lg font-semibold transition px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md shadow" >
                    Get All Chronicles
                  </Link>
                </div> */}
                <div className="flex items-center gap-2">
                  {isAuth === 'true' ? (
                    <Link href="/dashboard" className="px-5 py-2 rounded-lg bg-gradient-to-r from-pink-400 to-violet-400 text-white font-semibold shadow hover:from-pink-500 hover:to-violet-500 transition" >
                      Dashboard
                    </Link>
                  ) : (
                    <Link href="/login" className="px-5 py-2 rounded-lg bg-gradient-to-r from-pink-400 to-violet-400 text-white font-semibold shadow hover:from-pink-500 hover:to-violet-500 transition" >
                      Login
                    </Link>
                  )}
                </div>
              </nav>

              {/* Mobile: Center link below logo */}
              <div className="md:hidden flex justify-center pb-2">
                <Link href="/getAllChronicles" className="text-white/90 hover:text-pink-300 text-lg font-semibold transition px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md shadow">
                  Get All Chronicles
                </Link>
              </div>
            </header>
          </div>
        </div>
      </div>

    </>
  );
}

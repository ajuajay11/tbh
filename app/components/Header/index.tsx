import { cookies } from 'next/headers';
import Link from 'next/link';

export default async function Index() {
  const cookieStore = await cookies();
  const isAuth = cookieStore.get('isAuthenticated')?.value;

  return (
    <header className="w-full bg-gradient-to-tr from-[#22223b]/80 via-[#4a4e69]/80 to-[#9a8c98]/80 backdrop-blur-lg border-b border-white/20 shadow-lg sticky top-0 z-40">
      <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center">
            <span className="text-white text-2xl font-bold tracking-wide px-4 py-1 rounded-lg bg-white/10 backdrop-blur-md shadow">TBH</span>
          </Link>
        </div>

        {/* Center: Get All Chronicles */}
        <div className="hidden md:flex flex-1 justify-center">
          <Link
            href="/getAllChronicles"
            className="text-white/90 hover:text-pink-300 text-lg font-semibold transition px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md shadow"
          >
            Get All Chronicles
          </Link>
        </div>

        {/* Right: Auth Button */}
        <div className="flex items-center gap-2">
          {isAuth === 'true' ? (
            <Link
              href="/dashboard"
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-pink-400 to-violet-400 text-white font-semibold shadow hover:from-pink-500 hover:to-violet-500 transition"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-pink-400 to-violet-400 text-white font-semibold shadow hover:from-pink-500 hover:to-violet-500 transition"
            >
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile: Center link below logo */}
      <div className="md:hidden flex justify-center pb-2">
        <Link
          href="/getAllChronicles"
          className="text-white/90 hover:text-pink-300 text-lg font-semibold transition px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md shadow"
        >
          Get All Chronicles
        </Link>
      </div>
    </header>

  );
}

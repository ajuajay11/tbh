import Link from "next/link";
import Logout from "@/app/components/logout"
export default function page() {
  return (
    <>
      <section className="max-w-lg mx-auto mt-10 grid grid-cols-1 gap-6">
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-lg p-6 transition hover:scale-[1.02] hover:shadow-2xl">
          <Link href="/dashboard/my-profile" className="text-lg font-semibold text-white hover:text-pink-400 transition">My Profile</Link>
        </div>
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-lg p-6 transition hover:scale-[1.02] hover:shadow-2xl">
          <Link href="/dashboard/mychronicles" className="text-lg font-semibold text-white hover:text-pink-400 transition">My Chronicles</Link>
        </div>
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-lg p-6 text-lg font-semibold text-white">
          Settings
        </div>
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-lg p-6 text-lg font-semibold text-white">
          Inclusion
        </div>
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-lg p-6">
          <Logout />
        </div>
      </section>

    </>
  )
}

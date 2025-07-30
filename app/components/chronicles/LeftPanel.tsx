import Link from "next/link";

export default function LeftPanel() {
  return (
    <>
      <section className="w-1/5 pt-20 p-4 border-r border-zinc-700 hidden lg:block">
        <h2 className="text-xl font-bold mb-4">Sidebar</h2>
        <ul className="space-y-2">
          <li className="hover:text-pink-400 cursor-pointer"> Home</li>
          <li className="hover:text-pink-400 cursor-pointer"> Posts</li>
          <li className="hover:text-pink-400 cursor-pointer"> Stats</li>
          <li className="hover:text-pink-400 cursor-pointer"> Settings</li>
        </ul>
      </section>
      <section className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-red-600 text-white p-4 rounded-full z-50 shadow-lg lg:hidden">
        <div className="flex justify-between items-center px-6 py-3 text-white">
          
          <button className="flex flex-col items-center hover:text-pink-400">
            <span className="text-xl">🏠</span>
           </button>
           
          <div className="relative -mt-6">
            <Link href="/dashboard/mychronicles" className="bg-red-500 text-white p-4 rounded-full shadow-lg hover:bg-pink-600 transition">
              ➕
            </Link>
          </div>
           
          <button className="flex flex-col items-center hover:text-pink-400">
            <span className="text-xl">⚙️</span>
           </button>
        </div>
      </section>

    </>
  )
}


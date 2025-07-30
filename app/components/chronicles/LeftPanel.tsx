 
 
export default function LeftPanel() {
  return (
       <>
        <section className="w-1/5 pt-20 p-4 border-r border-zinc-700">
          <h2 className="text-xl font-bold mb-4">Sidebar</h2>
          <ul className="space-y-2">
            <li className="hover:text-pink-400 cursor-pointer">🏠 Home</li>
            <li className="hover:text-pink-400 cursor-pointer">📄 Posts</li>
            <li className="hover:text-pink-400 cursor-pointer">📊 Stats</li>
            <li className="hover:text-pink-400 cursor-pointer">⚙️ Settings</li>
          </ul>
        </section>
      </>
  )
}

 
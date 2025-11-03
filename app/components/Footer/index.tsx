export default function Index() {
  return (
    <>
      <footer className="w-full bg-gradient-to-tr from-[#33333]/80 via-[#000]/80 to-[#9a8c98]/80 backdrop-blur-lg border-t border-white/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-white text-lg font-bold tracking-wide">
              Chronicles
            </span>
            <span className="text-pink-400 text-2xl">•</span>
            <span className="text-white/70 text-sm">Share your story</span>
          </div>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-white/70 hover:text-pink-300 transition"
            >
              {" "}
            </a>
            <a
              href="#"
              className="text-white/70 hover:text-pink-300 transition"
            >
              {" "}
            </a>
            <a
              href="#"
              className="text-white/70 hover:text-pink-300 transition"
            >
              {" "}
            </a>
          </div>
          <div className="text-white/50 text-xs">
            &copy; {new Date().getFullYear()} Chronicles. All rights reserved.
          </div>
        </div>
        <div className="lg:none" style={{height:"50px"}}></div>
      </footer>
    </>
  );
}

"use client";

import Link from "next/link";
import { Home, FileText, BarChart3 } from "lucide-react"; // icons

export default function Sidenav() {
  return (
    <aside className="h-screen w-60 flex flex-col p-4 font-bold text-[#980000]">
      {/* App name or logo */}
      <Link href="/" className="font_two font-bold mb-5 mx-2">Chronicles</Link>

      {/* Navigation items */}
      <nav className="flex flex-col gap-4">
        <Link
          href="/tbh-admin"
          className="flex items-center gap-3 px-3 py-2"
        >
          <Home size={20} />
          <span>Home</span>
        </Link>

        <Link
          href="/reports"
          className="flex items-center gap-3 px-3 py-2"
        >
          <FileText size={20} />
          <span>Reports</span>
        </Link>

        <Link
          href="/posts"
          className="flex items-center gap-3 px-3 py-2"
        >
          <BarChart3 size={20} />
          <span>Posts</span>
        </Link>
      </nav>
    </aside>
  );
}

import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function LeftPanel() {
  return (
    <>
      {/* Sidebar (desktop) */}
      <section
        className="relative w-1/5 min-h-screen p-6 hidden lg:flex flex-col items-center justify-start"
        data-aos="fade-left"
      >
        {/* Sidebar content (e.g., avatar) */}
      </section>

      {/* Centered Add Button (all screen sizes) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2">
        <Link
          href="/dashboard/add-chronicle"
          className="tbh_button text-white p-4 rounded-full shadow-xl 
                     hover:scale-110 transition-transform duration-300 animate-bounce-slow flex items-center justify-center"
        >
          <PlusCircle size={30} strokeWidth={2.5} />
        </Link>
      </div>
    </>
  );
}

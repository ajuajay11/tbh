'use client';

import { useEffect, useState, useRef } from 'react';
import Cookies from 'js-cookie';
import Image from 'next/image';
import Link from 'next/link';

export default function DropDown() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const cookieVal = Cookies.get('avatar');
    if (cookieVal) setAvatarUrl(cookieVal);

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!mounted) {
    return <div className="w-8 h-8 rounded-full bg-gray-200" />;
  }

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button onClick={() => setOpen(o => !o)} className="focus:outline-none">
        {avatarUrl ? (
          <Image src={avatarUrl} alt="User Avatar" width={32} height={32} className="rounded-full" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-300" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 w-48 bg-[#333] rounded-sm shadow-lg ring-1 ring-black/5 z-10 py-4">
          <Link href="/dashboard" className="block px-4 py-2 " onClick={() => setOpen(false)} >
            Profile
          </Link>
          <Link href="/settings" className="block px-4 py-2 " onClick={() => setOpen(false)} >
            Settings
          </Link>
          <button onClick={() => { Cookies.remove('token'); Cookies.remove('avatar'); setOpen(false); window.location.href = '/login'; }} className="w-full text-left block px-4 py-2 ">
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

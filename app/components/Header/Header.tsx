"use client";

import { usePathname } from "next/navigation";
import {
  User,
  House,
  CirclePlus,
  BookOpenText,
  UserRoundPen,
  ListCollapse,
} from "lucide-react";
import Link from "next/link";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import LogOut from "@/app/components/logout/index";

export default function Header() {
  const pathname = usePathname();
  const [token, setToken] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [mock, setMock] = useState(true); // start hidden
 
  const setMockFn = () => {
    setMock((prev) => !prev);
  };
useEffect(() => {
  const handleResize = () => {
    if (window.innerWidth > 1024) {
      // lg breakpoint (Tailwind's default)
      setMock(true);
    }  
  };

  // Run once on mount
  handleResize();

  // Listen to window resize
  window.addEventListener("resize", handleResize);

  // Cleanup on unmount
  return () => window.removeEventListener("resize", handleResize);
}, []);
  useEffect(() => {
    setMounted(true);
    setToken(Cookies.get("token") ?? null);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <div className="block lg:hidden mockstand" onClick={setMockFn}>
        <ListCollapse />
      </div>

      {/* Always keep nav mounted for animation */}
      <nav
        className={`fixed bottom-[5%] left-1/2 z-50 transition-all duration-700 
        ease-[cubic-bezier(0.68,-0.55,0.27,1.55)] transform
        ${
          mock
            ? "translate-x-[-50%] translate-y-0 scale-100 opacity-100"
            : "translate-x-[50%] translate-y-[30%] scale-75 opacity-0"
        }`}
      >
        <div className="flex gap-5">
          {token ? (
            <>
              {pathname === "/chronicles" ? (
                <>
                  <Link className="mock" href="/dashboard/my-profile">
                    <UserRoundPen />
                  </Link>
                  <Link className="mock" href="/dashboard/write-chronicle">
                    <CirclePlus />
                  </Link>
                  <LogOut />
                </>
              ) : (
                <>
                  <Link className="mock" href="/chronicles">
                    <BookOpenText />
                  </Link>
                  {pathname === "/dashboard/my-profile" ? (
                    <Link className="mock" href="/dashboard/write-chronicle">
                      <CirclePlus />
                    </Link>
                  ) : (
                    <Link className="mock" href="/dashboard">
                      <UserRoundPen />
                    </Link>
                  )}
                  <LogOut />
                </>
              )}
            </>
          ) : (
            <>
              {pathname === "/login" ? (
                <Link className="mock" href="/">
                  <House />
                </Link>
              ) : (
                <Link className="mock" href="/login">
                  <User />
                </Link>
              )}
            </>
          )}
        </div>
      </nav>
    </>
  );
}

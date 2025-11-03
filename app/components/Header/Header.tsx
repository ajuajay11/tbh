"use client";

import { usePathname } from "next/navigation";
import {
  User,
  House,
  CirclePlus,
  BookOpenText,
  UserRoundPen,
  ListCollapse,X,
  Menu,
} from "lucide-react";
import Link from "next/link";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import LogOut from "@/app/components/logout/index";
 
export default function Header() {
  const pathname = usePathname();
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [mock, setMock] = useState(true); // start hidden
  const [togglemenu, setTogglemenu] = useState<boolean | null>(false);
  const setMockFn = () => {
    setMock((prev) => !prev);
  };
  const togglemenuFn = () => {
    setTogglemenu((prev) => !prev);
  }
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setMock(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Cleanup on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    setMounted(true);
    setToken(Cookies.get("token") ?? null);
    setUsername(Cookies.get("username") ?? null);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <div className="block lg:hidden mockstand" onClick={setMockFn}>
        <ListCollapse />
      </div>
      {
        pathname !== "/chronicles" ? (
          <button onClick={togglemenuFn} className="fixed right-5 top-3" style={{ zIndex: "99" }}>
            <div data-aos="fade-in">{!togglemenu ?<Menu /> : <X />}</div>
          </button>
        ) : null
      }
      {togglemenu && (
        <div data-aos="fade-in" className="fixed top-2 right-2 w-2/3 bg-zinc-950 border-slate-50 text-white p-6 z-50 shadow-lg animate-slide-in" style={{borderRadius:"10px"}}>
         
          <nav className="flex flex-col space-y-4">
            <Link href="/" onClick={togglemenuFn}>Home</Link>
            <Link href="/why-tbh" onClick={togglemenuFn}>Why TBH?</Link>
            <Link href="/terms-and-conditions" onClick={togglemenuFn}>Terms & Conditions</Link>
            <Link href="/chronicles" onClick={togglemenuFn}>Chronicles</Link>
          </nav>
        </div>
      )}
      
      <nav
        className={`fixed w-full md:w-auto bottom-0 md:bottom-[2%] md:left-1/2 z-50 transition-all duration-700 custom-ease transform ${
          mock
            ? "md:translate-x-[-50%] translate-y-0 scale-100 opacity-100"
            : "md:translate-x-[50%] translate-y-[30%] scale-75 opacity-0"
        }`}
      >
        <div className="flex  w-full md:gap-3">
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
                    <Link className="mock" href={`/dashboard?user=${username}`}>
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

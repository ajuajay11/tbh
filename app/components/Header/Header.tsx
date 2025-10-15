"use client";

import { usePathname } from "next/navigation";
import { User, House, CirclePlus, BookOpenText } from "lucide-react";
import Link from "next/link";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import LogOut from "@/app/components/logout/index"
export default function Header() {
  const pathname = usePathname();
  const [token, setToken] = useState<string | null>(null);

  // Read cookie after mount to avoid hydration mismatch
  useEffect(() => {
    setToken(Cookies.get("token") ?? null);
  }, []);

  return (
    <nav>
      {token ? (
        <div className="navMock">
          
             {pathname === "/chronicles"?<div className="flex">
            <Link className="mock" href="dashboard/write-chronicle"><CirclePlus/></Link>
            <Link className="mock" href="dashboard/my-profile"><BookOpenText/></Link>
         
             <LogOut/>
           
             
           </div>:<div></div>}
        </div>
          
       ) : (
        <div>
          {pathname === "/login" ? (
            <Link className="mock mock-neomorphism" href="/">
              <House />
            </Link>
          ) : (
            <Link className="mock mock-neomorphism" href="/login">
              <User />
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

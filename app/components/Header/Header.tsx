"use client";

import { usePathname } from "next/navigation";
import { User, House, CirclePlus, BookOpenText } from "lucide-react";
import Link from "next/link";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";

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
        <div>
          {pathname === "/chronicles" ? (
            <Link className="mock mock-neomorphism" href="/dashboard">
              <CirclePlus />
            </Link>
          ) : (
            <Link className="mock mock-neomorphism" href="/">
              <BookOpenText />
            </Link>
          )}
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

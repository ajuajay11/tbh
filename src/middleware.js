import { NextResponse } from "next/server";

const isAuthenticated = true;
export function middleware(request) {
  if (!isAuthenticated) {
    if (["/login"].includes(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }  
  if (isAuthenticated) {
    return NextResponse.next();
  }
  if (isAuthenticated) {
    if (["/dashboard"].includes(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
}

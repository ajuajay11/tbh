import { NextResponse,NextRequest } from "next/server";
// import Cookies from 'js-cookie';

export function middleware(request:NextRequest) {
 const token = request.cookies.get('token')?.value; // Access the token from cookies
  if (token) {
    if (["/login", "/register"].includes(request.nextUrl.pathname) ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  if (token) {
    return NextResponse.next();
  }
  if (!token) {
    if (["/dashboard"].includes(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
}

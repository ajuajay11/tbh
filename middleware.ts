import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const response = NextResponse.next();

  // Apply CORS headers
  response.headers.set("Access-Control-Allow-Origin","*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight (OPTIONS) requests
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: response.headers,
    });
  }
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value;
  const pathname = request.nextUrl.pathname;

  // Redirect authenticated users from landing and auth pages to main content
  if (token) {
    if (["/login", "/register", "/"].includes(pathname)) {
      return NextResponse.redirect(new URL("/chronicles", request.url));
    }
    // Let authenticated users access other routes
    return NextResponse.next();
  }
  if(role){
     if (["/tbh-admin"].includes(pathname)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    // Let authenticated users access other routes
    return NextResponse.next();
  }

  // Protect dashboard and chronicles routes for non-authenticated users
  const protectedRoutes = [
    "/dashboard",
    "/chronicles",
    "/dashboard/my-profile"
  ];

  // Match dynamic /chronicles/:id route
  if (!token && (protectedRoutes.includes(pathname) || pathname.startsWith("/chronicles/"))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Allow all other requests
  return NextResponse.next();
}

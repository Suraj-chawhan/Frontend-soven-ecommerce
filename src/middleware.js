import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const token = await getToken({ req });
  const url = req.nextUrl.clone();

  // If there is no token or if the user doesn't have the role 'admin', redirect them to the homepage
  if (!token || token.role !== "admin") {
    if (url.pathname.startsWith("/admin")) {
      url.pathname = "/";
      return NextResponse.redirect(url); // Redirect to homepage if they try to access /admin
    }
  } else if (token.role === "admin") {
    // If user is an admin, but is already on /admin, just allow access
    if (url.pathname === "/admin") {
      return NextResponse.next();
    }
  }

  return NextResponse.next(); // Allow request to proceed if no redirect is required
}

// Apply middleware only to specific routes
export const config = {
  matcher: ["/admin/:path*", "/admin"],
};

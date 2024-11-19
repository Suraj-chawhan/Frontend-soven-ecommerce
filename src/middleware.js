import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const token = await getToken({ req });
  const url = req.nextUrl.clone();

  // Redirect unauthenticated users to login
  if (!token) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Redirect admins to /admin from any non-admin route
  if (token.role === "admin" ) {
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  // Redirect non-admins away from /admin routes
  if (token.role !== "admin" && url.pathname.startsWith("/admin")) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Allow requests to proceed if no redirection is needed
  return NextResponse.next();
}

// Apply middleware to specific routes
export const config = {
  matcher: ["/admin"], // Include home, login, and admin routes
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || "super-secret-default-key-for-dev",
  });
  const { pathname } = req.nextUrl;

  // 1. If user is logged in, prevent accessing login/signup and redirect to correct dashboards
  if (token && (pathname === "/login" || pathname === "/signup")) {
    const roles = token.roles || [];
    if (roles.includes("ADMIN")) {
      return NextResponse.redirect(new URL("/admin/approvals", req.url));
    }
    if (roles.includes("OWNER")) {
      return NextResponse.redirect(new URL("/dashboard/owner/overview", req.url));
    }
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 2. Redirect /dashboard to the role-specific dashboard
  if (pathname === "/dashboard") {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    const roles = token.roles || [];
    if (roles.includes("ADMIN")) {
      return NextResponse.redirect(new URL("/admin/approvals", req.url));
    }
    if (roles.includes("OWNER")) {
      return NextResponse.redirect(new URL("/dashboard/owner/overview", req.url));
    }
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 3. Protect /bookings route
  if (pathname.startsWith("/bookings")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // 4. Protect /admin routes
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    const roles = token.roles || [];
    if (!roles.includes("ADMIN")) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // 5. Protect /dashboard/owner routes
  if (pathname.startsWith("/dashboard/owner")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    const roles = token.roles || [];
    if (!roles.includes("OWNER")) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/bookings",
    "/bookings/:path*",
    "/admin",
    "/admin/:path*",
    "/login",
    "/signup",
  ],
};

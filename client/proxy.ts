import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function isApplicationRoute(pathname: string) {
  return (
    pathname === "/auth" ||
    pathname === "/tasks" ||
    pathname === "/tasks/new" ||
    pathname === "/api/auth/refresh" ||
    /^\/tasks\/[^/]+(?:\/edit)?$/.test(pathname)
  );
}

export function proxy(request: NextRequest) {
  if (isApplicationRoute(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/tasks";

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

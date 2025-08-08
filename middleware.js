import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl.clone();
  const role = req.cookies.get("role")?.value;        // "staff" | "student"
  const studentId = req.cookies.get("studentId")?.value;

  // Staff-only section
  if (url.pathname.startsWith("/portal/students")) {
    if (role !== "staff") {
      url.pathname = "/portal/me";
      return NextResponse.redirect(url);
    }
  }

  // Student-only section: must have a studentId cookie
  if (url.pathname.startsWith("/portal/me")) {
    if (role !== "student" || !studentId) {
      url.pathname = "/portal/login";
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}
export const config = { matcher: ["/portal/:path*"] };

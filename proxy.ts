// Next 16 proxy (renamed from middleware.ts).
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** rr-preview URL compatibility at the HTTP layer — the rr sandbox serves
 *  this template at `/preview/<slug>/{public,dashboard}/…`; standalone it
 *  lives at root. Redirect here (before any rendering) so template pages +
 *  databases stay testable with either URL shape:
 *    /preview/<slug>/public/d/doc-x   → /d/doc-x
 *    /preview/<slug>/public/db/db-x   → /db/db-x
 *    /preview/<slug>/dashboard/admin  → /dashboard/admin
 *    /preview/<slug>                  → /
 *  (app/preview/[...rest] stays as an in-app fallback.) */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/preview/")) {
    const [, , , area, ...tail] = pathname.split("/"); // ["", "preview", slug, area, ...]
    const dest =
      area === "public"
        ? `/${tail.join("/")}`
        : area === "dashboard"
          ? `/dashboard/${tail.join("/")}`.replace(/\/$/, "")
          : "/";
    return NextResponse.redirect(new URL(dest || "/", req.url), 308);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

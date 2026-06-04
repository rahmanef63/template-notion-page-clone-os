import { redirect } from "next/navigation";

/** rr-preview URL compatibility — the rr sandbox serves this template at
 *  `/preview/<slug>/{public,dashboard}/…`; standalone it lives at root.
 *  Links copied from rr (or hardcoded preview hrefs) land here and get
 *  redirected to the real route, so template pages + databases stay
 *  testable with either URL shape:
 *    /preview/<slug>/public/d/doc-x   → /d/doc-x
 *    /preview/<slug>/public/db/db-x   → /db/db-x
 *    /preview/<slug>/dashboard/admin  → /dashboard/admin
 *    /preview/<slug>                  → /
 */
export default async function PreviewCompat({
  params,
}: {
  params: Promise<{ rest: string[] }>;
}) {
  const { rest = [] } = await params;
  // rest[0] = template slug (ignored), rest[1] = area
  const [, area, ...tail] = rest;
  if (area === "public") redirect(tail.length ? `/${tail.join("/")}` : "/");
  if (area === "dashboard") redirect(tail.length ? `/dashboard/${tail.join("/")}` : "/dashboard");
  redirect("/");
}

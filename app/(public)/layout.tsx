import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import { StoreProvider } from "@/components/templates/notion-page-clone/shared/store";
import { DEFAULT_SITE_CONFIG } from "@/components/templates/notion-page-clone/shared/site-config";
import { DemoRibbon } from "@/components/demo-ribbon";
import { AiChatFab } from "@/components/ai-chat-fab";

const c = DEFAULT_SITE_CONFIG;

/** Demo/clone-aware canonical origin — env wins over the seeded
 *  site-config domain so og/canonical URLs always match the real host. */
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  title: { default: `${c.productName} — ${c.tagline}`, template: `%s — ${c.productName}` },
  description: c.description,
  applicationName: c.productName,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    siteName: c.productName,
    title: `${c.productName} — ${c.tagline}`,
    description: c.description,
    url: SITE_URL,
  },
  twitter: { card: "summary_large_image" },
};

/** Notion-clone public layout — BZ-wave (2026-05-21).
 *  Previously wrapped in SiteShell (marketing header + footer). User
 *  request: "tidak perlu ada header dan footer ... langsung saja
 *  workspacenya" — strip the chrome, render Dashboard full-bleed so
 *  the template behaves like the real Notion app, not a marketing
 *  site about one. */
export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <StoreProvider>
        {children}
        <AiChatFab />
        <DemoRibbon />
      </StoreProvider>
    </Suspense>
  );
}

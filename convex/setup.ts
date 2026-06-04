import { action, query } from "./_generated/server";
import { createAccount } from "@convex-dev/auth/server";
import { api } from "./_generated/api";

// Onboarding state for the admin UI. Public (no PII) so the login form and the
// dashboard setup banner can adapt before/after sign-in. Part of headless-core.
export const status = query({
  args: {},
  handler: async (ctx) => {
    const owner = await ctx.db.query("users").first();
    const settings = await ctx.db.query("siteSettings").first();
    const ownerClaimed = !!owner;
    // Signup policy: admin-menu setting first, legacy env key as fallback
    // (see convex/auth.ts for the matching enforcement).
    const policy =
      settings?.signupPolicy ??
      (process.env.ADMIN_SIGNUP_KEY ? "invite-env" : "closed");
    const inviteKeySet =
      policy === "invite" ? !!settings?.inviteKey : !!process.env.ADMIN_SIGNUP_KEY;
    const workspaceDoc = await ctx.db.query("notion_docs").first();
    return {
      ownerClaimed,
      // Workspace counts as seeded once any doc has been persisted.
      seeded: !!workspaceDoc,
      // Onboarding wizard is done once the owner finishes it (onboardedAt set).
      onboarded: !!settings?.onboardedAt,
      // Open before the first claim; afterwards per policy.
      signupOpen:
        !ownerClaimed ||
        policy === "open" ||
        ((policy === "invite" || policy === "invite-env") && inviteKeySet),
      // The "Setup key" field is only needed for invite-gated signups.
      signupKeyRequired:
        ownerClaimed && (policy === "invite" || policy === "invite-env") && inviteKeySet,
    };
  },
});

// Auto-create the owner from env (ADMIN_EMAIL + ADMIN_PASSWORD) on a fresh site —
// zero-touch admin for a clone. Safe: no-ops once any owner exists, and only acts
// on values the deployer set in their own Convex env. The login form calls this
// on first load; the owner can then sign in with those credentials.
export const bootstrapAdmin = action({
  args: {},
  handler: async (ctx) => {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    if (!email || !password) return { ok: false, reason: "no-env" as const };
    const s = await ctx.runQuery(api.setup.status, {});
    if (s.ownerClaimed) return { ok: false, reason: "owner-exists" as const };
    try {
      await createAccount(ctx, {
        provider: "password",
        account: { id: email, secret: password },
        profile: { email, name: email },
      });
      return { ok: true as const, email };
    } catch {
      return { ok: false, reason: "create-failed" as const };
    }
  },
});

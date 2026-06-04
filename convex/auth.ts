import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { ConvexError } from "convex/values";

// Zero-config admin onboarding + admin-menu signup policy:
// - Fresh clone (no admin yet): the FIRST signup claims ownership, no secret.
// - After the owner exists, `siteSettings.signupPolicy` (set from the admin
//   Settings menu) decides who else may register:
//     "open"   → anyone can sign up
//     "invite" → signup requires the admin-set `siteSettings.inviteKey`
//     unset    → legacy fallback: ADMIN_SIGNUP_KEY env if set, else closed.
// Existing users can always sign in regardless.
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password({
      profile(params) {
        const email = params.email as string;
        const name = (params.name as string | undefined) || email;
        // signupKey rides along to createOrUpdateUser (validated there against
        // the admin-set invite key) — it is stripped before the user row insert.
        // Conditional spread: profile values must not be `undefined`.
        return {
          email,
          name,
          ...(typeof params.signupKey === "string" ? { signupKey: params.signupKey } : {}),
        };
      },
    }),
  ],
  callbacks: {
    async createOrUpdateUser(ctx, args) {
      // Existing user signing in / linking → allow untouched.
      if (args.existingUserId) return args.existingUserId;

      const email = args.profile.email as string | undefined;
      // Dedupe by email so re-signup doesn't create a twin.
      if (email) {
        const existing = await ctx.db
          .query("users")
          .filter((q) => q.eq(q.field("email"), email))
          .first();
        if (existing) return existing._id;
      }

      const firstUser = await ctx.db.query("users").first();
      if (firstUser) {
        const settings = await ctx.db.query("siteSettings").first();
        const supplied = args.profile.signupKey as string | undefined;
        const policy =
          settings?.signupPolicy ??
          (process.env.ADMIN_SIGNUP_KEY ? "invite-env" : "closed");
        if (policy === "open") {
          // anyone may register
        } else if (policy === "invite") {
          const key = settings?.inviteKey;
          if (!key || supplied !== key) {
            throw new ConvexError("Pendaftaran hanya dengan undangan — kunci salah.");
          }
        } else if (policy === "invite-env") {
          if (supplied !== process.env.ADMIN_SIGNUP_KEY) {
            throw new ConvexError("Setup key salah.");
          }
        } else {
          throw new ConvexError("Pendaftaran sudah ditutup.");
        }
      }

      return ctx.db.insert("users", {
        email,
        name: (args.profile.name as string | undefined) ?? email,
      });
    },
  },
});

import { mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";

/** Sample-content seed hook for the onboarding wizard. This template's
 *  workspace seeds itself CLIENT-side (SEED_STATE in the localStorage
 *  store, persisted to `notion_docs` by ConvexSync once the owner edits),
 *  so the server-side seed is a no-op marker — kept so the wizard's
 *  "isi contoh konten" step works the same as the rest of the fleet. */
export const seedSample = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Harus login sebagai admin.");
    return { ok: true, note: "workspace seeds client-side" };
  },
});

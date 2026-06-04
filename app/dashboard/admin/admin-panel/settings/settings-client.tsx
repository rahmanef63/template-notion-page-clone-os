"use client";

import * as React from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe2, KeyRound, Lock, Save } from "lucide-react";
import { toast } from "sonner";

/** Admin Settings — site identity + SIGNUP POLICY toggle:
 *    "open"   → orang asing boleh daftar sendiri
 *    "invite" → hanya yang diizinkan (pakai kunci undangan dari sini) */
export function SettingsClient() {
  const settings = useQuery(api.settings.adminGet);
  const upsert = useMutation(api.settings.upsert);
  const [siteName, setSiteName] = React.useState("");
  const [policy, setPolicy] = React.useState<"open" | "invite">("invite");
  const [inviteKey, setInviteKey] = React.useState("");
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    if (hydrated || settings === undefined) return;
    setSiteName(settings?.siteName ?? "");
    setPolicy(settings?.signupPolicy === "open" ? "open" : "invite");
    setInviteKey(settings?.inviteKey ?? "");
    setHydrated(true);
  }, [settings, hydrated]);

  const save = async () => {
    try {
      await upsert({ siteName: siteName || undefined, signupPolicy: policy, inviteKey });
      toast.success("Pengaturan tersimpan.");
    } catch {
      toast.error("Gagal menyimpan — coba lagi.");
    }
  };

  if (settings === undefined) {
    return <div className="h-48 animate-pulse rounded-xl border bg-muted/30" />;
  }
  return (
    <div className="max-w-2xl space-y-6 p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle>Identitas situs</CardTitle>
          <CardDescription>Nama yang tampil di workspace & metadata.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label htmlFor="siteName">Nama situs</Label>
          <Input id="siteName" value={siteName} onChange={(e) => setSiteName(e.target.value)} placeholder="Workspace-ku" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Lock className="size-4" /> Kebijakan pendaftaran</CardTitle>
          <CardDescription>
            Siapa yang boleh membuat akun di workspace ini (selain kamu).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2 sm:grid-cols-2">
            <Button
              type="button"
              variant={policy === "open" ? "default" : "outline"}
              onClick={() => setPolicy("open")}
              className="h-auto flex-col items-start gap-1 p-4 text-left"
            >
              <span className="flex items-center gap-2 font-semibold"><Globe2 className="size-4" /> Terbuka</span>
              <span className="text-xs font-normal opacity-80">Siapa pun boleh daftar sendiri.</span>
            </Button>
            <Button
              type="button"
              variant={policy === "invite" ? "default" : "outline"}
              onClick={() => setPolicy("invite")}
              className="h-auto flex-col items-start gap-1 p-4 text-left"
            >
              <span className="flex items-center gap-2 font-semibold"><KeyRound className="size-4" /> Hanya diundang</span>
              <span className="text-xs font-normal opacity-80">Daftar wajib pakai kunci undangan di bawah.</span>
            </Button>
          </div>
          {policy === "invite" && (
            <div className="space-y-2">
              <Label htmlFor="inviteKey">Kunci undangan</Label>
              <Input
                id="inviteKey"
                value={inviteKey}
                onChange={(e) => setInviteKey(e.target.value)}
                placeholder="mis. tim-rahasia-2026"
              />
              <p className="text-xs text-muted-foreground">
                Bagikan kunci ini ke orang yang kamu izinkan. Kosong = tidak ada yang bisa daftar.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Button onClick={save} className="gap-2"><Save className="size-4" /> Simpan</Button>
    </div>
  );
}

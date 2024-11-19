// ProfileForm.tsx
'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile } from "./actions";
import { useRouter } from "next/navigation";

export function ProfileForm({ profile }) {
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    const displayName = formData.get("displayName") as string;
    const username = formData.get("username") as string;

    if (!displayName || !username) {
      return;
    }

    const result = await updateProfile(profile.id, {
      displayName,
      username,
    });

    if (!result.error) {
      router.refresh();
    }
  }

  return (
    <form action={handleSubmit}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            defaultValue={profile.username}
            required
          />
        </div>

        <div>
          <Label htmlFor="displayName">Display Name</Label>
          <Input
            id="displayName"
            name="displayName"
            defaultValue={profile.displayName}
            required
          />
        </div>
      </div>

      <div className="mt-6">
        <Button type="submit">Update Profile</Button>
      </div>
    </form>
  );
}

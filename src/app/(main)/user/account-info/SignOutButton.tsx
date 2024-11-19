
// SignOutButton.tsx
'use client';

import { Button } from "@/components/ui/button";
import { signOut } from "./actions";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.refresh();
  }

  return (
    <Button
      variant="outline"
      onClick={handleSignOut}
    >
      Sign Out
    </Button>
  );
}
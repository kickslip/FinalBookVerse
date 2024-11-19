
// DeleteAccountButton.tsx
'use client';

import { Button } from "@/components/ui/button";
import { deleteAccount } from "./actions";
import { useRouter } from "next/navigation";

export function DeleteAccountButton({ userId }: { userId: string }) {
  const router = useRouter();

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (confirmed) {
      await deleteAccount(userId);
      router.refresh();
    }
  }

  return (
    <Button
      variant="destructive"
      onClick={handleDelete}
    >
      Delete Account
    </Button>
  );
}

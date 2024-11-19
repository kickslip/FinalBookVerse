// ProfilePage.tsx
import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { revalidatePath } from "next/cache";
import { getUserProfile } from "./actions";
import { UserRole } from "@prisma/client";
import { ProfileForm } from "./ProfileForm";
import { DeleteAccountButton } from "./DeleteAccountButton";
import { SignOutButton } from "./SignOutButton";
import { Label } from "@/components/ui/label";

export default async function ProfilePage() {
  const { user, session } = await validateRequest();

  if (!user || !session) {
    redirect("/login");
  }

  // Check if user has appropriate role
  if (user.role !== UserRole.ADMIN && user.role !== UserRole.CUSTOMER) {
    return (
      <Card className="max-w-2xl mx-auto mt-8">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600">
            You do not have permission to view this page. This page is only accessible to administrators and customers.
          </p>
        </CardContent>
      </Card>
    );
  }

  const profileResult = await getUserProfile(user.id);

  if ("error" in profileResult) {
    return <div>Error loading profile: {profileResult.error}</div>;
  }

  const profile = profileResult.user;

  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <h2 className="text-2xl font-bold">Profile</h2>
        <p className="text-gray-600">Manage your account settings</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <ProfileForm profile={profile} />
        
        <div>
          <Label>Account Created</Label>
          <p className="text-gray-600">
            {new Date(profile.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div>
          <Label>Last Updated</Label>
          <p className="text-gray-600">
            {new Date(profile.updatedAt).toLocaleDateString()}
          </p>
        </div>

        <div className="flex space-x-4">
          <SignOutButton />
        </div>
      </CardContent>

      <CardFooter className="border-t pt-6">
        <div>
          <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
          <DeleteAccountButton userId={profile.id} />
        </div>
      </CardFooter>
    </Card>
  );
}
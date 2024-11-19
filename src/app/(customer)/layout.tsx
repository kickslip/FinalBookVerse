import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import SessionProvider from "./SessionProvider";
import Navbar from "@/app/(main)/Navbar";
import { Toaster } from "@/components/ui/toast";
import UpcomingBooksSidebar from "./customer/_components/UpcomingBooksSidebar";

export const dynamic = "force-dynamic";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await validateRequest();

  if (!session.user || session.user.role !== "CUSTOMER") redirect("/login");

  return (
    <SessionProvider value={session}>
      <Toaster />
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex w-full grow">
          <main className="flex-grow p-6">{children}</main>
          <aside className="hidden lg:block w-96">
            <div className="sticky top-4 p-4">
              <UpcomingBooksSidebar />
            </div>
          </aside>
        </div>
      </div>
    </SessionProvider>
  );
}
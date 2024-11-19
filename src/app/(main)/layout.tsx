import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import SessionProvider from "./SessionProvider";
import Navbar from "./Navbar";


export default async function Layout({children} : {children: React.ReactNode;}) {
    const { user, session } = await validateRequest();
    
    // Don't redirect here, let the client-side handle the redirection
    return (
      <SessionProvider initialSession={user && session ? { user, session } : undefined}>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <div className="max-w-7xl mx-auto p-5 flex w-full grow gap-5">
            {children}
          </div>
        </div>
      </SessionProvider>
    );
}
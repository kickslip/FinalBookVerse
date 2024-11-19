// app/(main)/SessionProvider.tsx
"use client";

import { Session, User } from "lucia";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface SessionContext {
  user: User & {
    role: "USER" | "CUSTOMER" | "ADMIN";
  };
  session: Session;
  status: "loading" | "authenticated" | "unauthenticated";
}

const SessionContext = createContext<SessionContext | null>(null);

export default function SessionProvider({
  children,
  initialSession,
}: React.PropsWithChildren<{ 
  initialSession?: { user: SessionContext['user']; session: Session } 
}>) {
  const router = useRouter();
  const [status, setStatus] = useState<SessionContext['status']>(
    initialSession ? "authenticated" : "loading"
  );
  const [sessionData, setSessionData] = useState<SessionContext | null>(
    initialSession 
      ? { ...initialSession, status: "authenticated" as const }
      : null
  );

  useEffect(() => {
    if (initialSession) return;

    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const data = await response.json();
        
        if (data.user && data.session) {
          setSessionData({ 
            user: data.user, 
            session: data.session,
            status: "authenticated"
          });
          setStatus("authenticated");
        } else {
          setStatus("unauthenticated");
          router.push('/login'); // Redirect to login if no session
        }
      } catch (error) {
        console.error('Failed to check session:', error);
        setStatus("unauthenticated");
        router.push('/login');
      }
    };

    checkSession();
  }, [initialSession, router]);

  return (
    <SessionContext.Provider 
      value={sessionData || { 
        user: null as any, 
        session: null as any, 
        status 
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}
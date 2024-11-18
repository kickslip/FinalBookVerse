// // app/(main)/SessionProvider.tsx
// "use client";

// import { Session, User } from "lucia";
// import React, { createContext, useContext, useState, useEffect } from "react";

// interface SessionContext {
//   user: User & {
//     role: "USER" | "CUSTOMER" | "ADMIN";
//   };
//   session: Session;
//   status: "loading" | "authenticated" | "unauthenticated";
// }

// const SessionContext = createContext<SessionContext | null>(null);

// export default function SessionProvider({
//   children,
//   initialSession,
// }: React.PropsWithChildren<{ 
//   initialSession?: { user: SessionContext['user']; session: Session } 
// }>) {
//   const [status, setStatus] = useState<SessionContext['status']>(
//     initialSession ? "authenticated" : "loading"
//   );
//   const [sessionData, setSessionData] = useState<SessionContext | null>(
//     initialSession 
//       ? { ...initialSession, status: "authenticated" as const }
//       : null
//   );

//   useEffect(() => {
//     // If we have initial session data, we can skip the loading state
//     if (initialSession) return;

//     // You might want to fetch the session data here if not provided
//     const checkSession = async () => {
//       try {
//         // Replace this with your actual session checking logic
//         const response = await fetch('/api/auth/session');
//         const data = await response.json();
        
//         if (data.user && data.session) {
//           setSessionData({ 
//             user: data.user, 
//             session: data.session,
//             status: "authenticated"
//           });
//           setStatus("authenticated");
//         } else {
//           setStatus("unauthenticated");
//         }
//       } catch (error) {
//         console.error('Failed to check session:', error);
//         setStatus("unauthenticated");
//       }
//     };

//     checkSession();
//   }, [initialSession]);

//   return (
//     <SessionContext.Provider 
//       value={sessionData || { 
//         user: null as any, 
//         session: null as any, 
//         status 
//       }}
//     >
//       {children}
//     </SessionContext.Provider>
//   );
// }

// export function useSession() {
//   const context = useContext(SessionContext);
//   if (!context) {
//     throw new Error("useSession must be used within a SessionProvider");
//   }
//   return context;
// }

"use client"

import { Session, User } from "lucia"
import React, { createContext, useContext } from "react";

interface SessionContext {
    user: User;
    session: Session;
}

const SessionContext = createContext<SessionContext | null>(null)

export default function SessionProvider({
    children,
    value
}: React.PropsWithChildren<{ value: SessionContext}>) {
    return(
    <SessionContext.Provider value={value}>
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
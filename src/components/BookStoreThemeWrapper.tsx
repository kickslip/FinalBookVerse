import React from 'react';
import { cn } from "@/lib/utils";

export function BookstoreThemeWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      {children}
    </div>
  );
}

export function BookCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn(
      "bg-card rounded-lg shadow-lg p-6 transition-all duration-200 hover:shadow-xl border border-border",
      className
    )}>
      {children}
    </div>
  );
}

export function BookGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {children}
    </div>
  );
}

export function BookHeader({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="text-4xl font-bold tracking-tight mb-8 text-foreground">
      {children}
    </h1>
  );
}

export function BookSearchBar({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative w-full max-w-2xl mx-auto mb-8">
      <input
        className={cn(
          "w-full px-4 py-2 rounded-full bg-background border border-input focus:outline-none focus:ring-2 focus:ring-primary",
          className
        )}
        {...props}
      />
      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
        <svg className="w-4 h-4 text-muted-foreground" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  );
}

export function BookTable({ className, ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-border">
      <table
        className={cn(
          "w-full text-left bg-card",
          className
        )}
        {...props}
      />
    </div>
  );
}

export function BookForm({ className, ...props }: React.FormHTMLAttributes<HTMLFormElement>) {
  return (
    <form
      className={cn(
        "space-y-6 bg-card p-6 rounded-lg border border-border",
        className
      )}
      {...props}
    />
  );
}
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";

const BookstoreThemeWrapper = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95 text-foreground">
      {children}
    </div>
  );
};

const NavbarStyled = ({ children }) => {
  return (
    <header className="sticky top-0 z-10 backdrop-blur-sm border-b border-border/40">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {children}
      </div>
    </header>
  );
};

const BookCard = ({ book }) => {
  const router = useRouter();
  
  return (
    <div 
      role="button"
      tabIndex={0}
      onClick={() => router.push(`/book/${book.id}`)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          router.push(`/book/${book.id}`);
        }
      }}
      className="group relative overflow-hidden rounded-lg border border-border/50 bg-card p-4 transition-all hover:border-primary/50 hover:shadow-lg cursor-pointer"
    >
      <div className="mb-4 aspect-[3/4] w-full overflow-hidden rounded-md bg-muted">
        <div className="h-full w-full bg-gradient-to-br from-primary/20 to-primary/10" />
      </div>
      <h3 className="line-clamp-1 text-lg font-semibold">{book.title}</h3>
      <p className="line-clamp-1 text-sm text-muted-foreground">{book.author}</p>
      <p className="mt-2 font-medium text-primary">${book.price}</p>
    </div>
  );
};

const FormWrapper = ({ children }) => {
  return (
    <div className="w-full max-w-md space-y-8 rounded-xl border border-border/50 bg-card p-8 shadow-lg">
      {children}
    </div>
  );
};

const StyledInput = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
});

StyledInput.displayName = 'StyledInput';

const PageHeader = ({ title, description }) => {
  return (
    <div className="mb-8 space-y-2">
      <h1 className="text-3xl font-serif font-bold tracking-tight">{title}</h1>
      {description && (
        <p className="text-muted-foreground">{description}</p>
      )}
    </div>
  );
};

export {
  BookstoreThemeWrapper,
  NavbarStyled,
  BookCard,
  FormWrapper,
  StyledInput,
  PageHeader
};

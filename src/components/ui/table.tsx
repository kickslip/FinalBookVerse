// components/ui/table.tsx
import { cn } from "@/lib/utils";
import { HTMLProps } from "react";

// Table component
export function Table({ className, ...props }: HTMLProps<HTMLTableElement>) {
  return (
    <div className="relative w-full overflow-auto">
      <table
        className={cn(
          "w-full caption-bottom text-sm",
          className
        )}
        {...props}
      />
    </div>
  );
}

// TableHeader component
export function TableHeader({ className, ...props }: HTMLProps<HTMLTableSectionElement>) {
  return (
    <thead className={cn("[&_tr]:border-b", className)} {...props} />
  );
}

// TableBody component
export function TableBody({ className, ...props }: HTMLProps<HTMLTableSectionElement>) {
  return <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />;
}

// TableRow component
export function TableRow({ className, ...props }: HTMLProps<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        "border-b transition-colors hover:bg-slate-100/50",
        className
      )}
      {...props}
    />
  );
}

// TableHead component
export function TableHead({ className, ...props }: HTMLProps<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "h-12 px-4 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  );
}

// TableCell component
export function TableCell({ className, ...props }: HTMLProps<HTMLTableCellElement>) {
  return (
    <td
      className={cn(
        "p-4 align-middle [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  );
}
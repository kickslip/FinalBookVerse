"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Link from "next/link";
import { Check, LogOut, Monitor, Moon, Sun, User, UserIcon } from "lucide-react";
import { logout } from "@/app/(auth)/actions";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import UserAvatar from "./UserAvatar";

interface UserButtonProps {
  className?: string;
}
export default function UserButton({ className }: UserButtonProps) {
  const { user, status } = useSession();
  const { theme, setTheme } = useTheme();
  const queryClient = useQueryClient();

  // Show loading state
  if (status === "loading") {
    return (
      <Button variant="ghost" size="icon" className={cn("rounded-full", className)}>
        <User className="size-4" />
      </Button>
    );
  }

  // Show login button if not authenticated
  if (status === "unauthenticated" || !user) {
    return (
      <Link href="/login">
        <Button variant="ghost" size="icon" className={cn("rounded-full", className)}>
          <User className="size-4" />
        </Button>
      </Link>
    );
  }

 
  const handleLogout = async () => {
    try {
      await QueryClient.clear();
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("rounded-full p-0", className)}
        >
          <UserAvatar avatarUrl={user.avatarUrl} size={40} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">Logged in as</p>
            <p className="text-xs text-muted-foreground">@{user.username}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
            <Link href={`/user/account-info`}>
            <DropdownMenuItem>
                <UserIcon className="mr-2 size-4"/>
                Profile
            </DropdownMenuItem>
            </Link>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Monitor className="mr-2 size-4" />
            Theme
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              {[
                { value: "system", label: "System", icon: Monitor },
                { value: "light", label: "Light", icon: Sun },
                { value: "dark", label: "Dark", icon: Moon },
              ].map(({ value, label, icon: Icon }) => (
                <DropdownMenuItem
                  key={value}
                  onClick={() => setTheme(value)}
                  className="cursor-pointer"
                >
                  <Icon className="mr-2 size-4" />
                  {label}
                  {theme === value && <Check className="ml-auto size-4" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { StyledInput } from "@/components/BookstoreTheme";
import { useDebounce } from "use-debounce";
import { useEffect, useState } from "react";

export default function BookSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") ?? "");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (debouncedSearchTerm) {
      router.push(`/?search=${debouncedSearchTerm}`);
    } else {
      router.push("/");
    }
  }, [debouncedSearchTerm, router]);

  return (
    <StyledInput
      type="search"
      placeholder="Search books..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full max-w-xl"
    />
  );
}

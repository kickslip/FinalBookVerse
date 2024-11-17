"use client";

import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useSummerActions } from "../customer/_store/useSummerStore";
import { useWinterActions } from "../customer/_store/useWinterStore";
import { useFashionActions } from "../customer/_store/useFashionStore";
import { useCamoActions } from "../customer/_store/useCamoStore";
import { useAfricanActions } from "../customer/_store/useAfricanStore";
import { useBaseballActions } from "../customer/_store/useBaseballStore";
import { useIndustrialActions } from "../customer/_store/useIndustrialStore";
import { useLeisureActions } from "../customer/_store/useLeisureStore";
import { useSignatureActions } from "../customer/_store/useSignatureStore";
import { useSportActions } from "../customer/_store/useSportStore";
import { useKidsActions } from "../customer/_store/useKidsCollectionStore";


export default function SearchField() {
  const pathname = usePathname() || "";
  const [searchValue, setSearchValue] = useState("");
  
  const { setSearchQuery: setSummerSearch } = useSummerActions();
  const { setSearchQuery: setWinterSearch } = useWinterActions();
  const { setSearchQuery: setFashionSearch } = useFashionActions();
  const { setSearchQuery: setCamoSearch } = useCamoActions();
  const { setSearchQuery: setKidsSearch } = useKidsActions();
  const { setSearchQuery: setAfricanSearch } = useAfricanActions();
  const { setSearchQuery: setBaseballSearch } = useBaseballActions();
  const { setSearchQuery: setIndustrialSearch } = useIndustrialActions();
  const { setSearchQuery: setLeisureSearch } = useLeisureActions();
  const { setSearchQuery: setSignatureSearch } = useSignatureActions();
  const { setSearchQuery: setSportSearch } = useSportActions();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const query = e.target.value;
    setSearchValue(query);

    if (pathname.includes("/fashion")) {
      setFashionSearch(query);
    } else if (pathname.includes("/summer")) {
      setSummerSearch(query);
    } else if (pathname.includes("/winter")) {
      setWinterSearch(query);
    } else if (pathname.includes("/camo")) {
      setCamoSearch(query);
    } else if (pathname.includes("/kids")) {
      setKidsSearch(query);
    } else if (pathname.includes("/african")) {
      setAfricanSearch(query);
    } else if (pathname.includes("/baseball")) {
      setBaseballSearch(query);
    } else if (pathname.includes("/industrial")) {
      setIndustrialSearch(query);
    } else if (pathname.includes("/leisure")) {
      setLeisureSearch(query);
    } else if (pathname.includes("/signature")) {
      setSignatureSearch(query);
    } else if (pathname.includes("/sport")) {
      setSportSearch(query);
    }
  }

  // Reset search when changing collections
  useEffect(() => {
    setSearchValue("");
    if (pathname.includes("/fashion")) {
      setFashionSearch("");
    } else if (pathname.includes("/summer")) {
      setSummerSearch("");
    } else if (pathname.includes("/winter")) {
      setWinterSearch("");
    } else if (pathname.includes("/camo")) {
      setCamoSearch("");
    } else if (pathname.includes("/kids")) {
      setKidsSearch("");
    } else if (pathname.includes("/african")) {
      setAfricanSearch("");
    } else if (pathname.includes("/baseball")) {
      setBaseballSearch("");
    } else if (pathname.includes("/industrial")) {
      setIndustrialSearch("");
    } else if (pathname.includes("/leisure")) {
      setLeisureSearch("");
    } else if (pathname.includes("/signature")) {
      setSignatureSearch("");
    } else if (pathname.includes("/sport")) {
      setSportSearch("");
    }
  }, [
    pathname,
    setSummerSearch,
    setWinterSearch,
    setFashionSearch,
    setCamoSearch,
    setKidsSearch,
    setAfricanSearch,
    setBaseballSearch,
    setIndustrialSearch,
    setLeisureSearch,
    setSignatureSearch,
    setSportSearch,
  ])
  , [pathname, setSummerSearch, setWinterSearch, setFashionSearch,setCamoSearch, setKidsSearch, setLeisureSearch, setSignatureSearch, setSportSearch];

  return (
    <form onSubmit={handleSubmit}>
      <div className="relative">
        <Input
          name="q"
          value={searchValue}
          placeholder="Search"
          className="pe-10 border-4 outline-none"
          onChange={handleChange}
        />
        <SearchIcon className="absolute right-3 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground" />
      </div>
    </form>
  );
}
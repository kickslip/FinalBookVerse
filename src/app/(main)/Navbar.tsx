import { NavbarStyled } from "@/components/BookstoreTheme";
import SearchField from "@/components/SearchField";
import UserButton from "@/components/UserButton";
import { Image } from "@radix-ui/react-avatar";
import Link from "next/link";
import { SiGitbook } from "react-icons/si";


export default function Navbar() {
  return (
    <NavbarStyled>
      <Link href="/" className="text-2xl font-serif font-bold text-primary">
        <span>BookVerse</span><SiGitbook />
      </Link>
      <div className="flex items-center gap-6">
        <SearchField />
        <UserButton className="ml-4" />
      </div>
    </NavbarStyled>
  );
}
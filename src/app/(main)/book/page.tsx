import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import BookTable from "./BookTable";
import BookSearch from "./BookSearch";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function BooksPage({
  searchParams,
}: {
  searchParams: { search?: string; page?: string };
}) {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized");

  const page = Number(searchParams.page) || 1;
  const pageSize = 10;

  const books = await prisma.book.findMany({
    where: {
      userId: user.id,
      OR: searchParams.search
        ? [
            { title: { contains: searchParams.search, mode: "insensitive" } },
            { author: { contains: searchParams.search, mode: "insensitive" } },
            { description: { contains: searchParams.search, mode: "insensitive" } },
          ]
        : undefined,
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { createdAt: "desc" },
  });

  const total = await prisma.book.count({
    where: {
      userId: user.id,
      OR: searchParams.search
        ? [
            { title: { contains: searchParams.search, mode: "insensitive" } },
            { author: { contains: searchParams.search, mode: "insensitive" } },
            { description: { contains: searchParams.search, mode: "insensitive" } },
          ]
        : undefined,
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
      </div>
      {/* <BookSearch /> */}
      <BookTable books={books} />
      <Link href="/book/create">
          <Button>Add Book</Button>
        </Link>
      
    </div>
  );
}
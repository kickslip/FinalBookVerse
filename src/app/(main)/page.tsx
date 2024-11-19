import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import BookTable from "@/app/(main)/book/BookTable";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import BookSearchPage from "./book/BookSearch";

export default async function BooksPage({
  searchParams,
}: {
  searchParams: { search?: string; page?: string };
}) {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized");

  const page = Number(searchParams.page) || 1;
  const pageSize = 12;

  // Modified query to fetch all books and include user information
  const books = await prisma.book.findMany({
    where: {
      // Removed userId filter to get all books
      OR: searchParams.search
        ? [
            { title: { contains: searchParams.search, mode: "insensitive" } },
            { author: { contains: searchParams.search, mode: "insensitive" } },
            { description: { contains: searchParams.search, mode: "insensitive" } },
          ]
        : undefined,
    },
    include: {
      user: {
        select: {
          displayName: true,
          id: true,
        },
      },
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { createdAt: "desc" },
  });

  // Only show Add Book button for admin users
  const showAddButton = user.role === "ADMIN";

  return (
    <div className="space-y-6">
      <BookTable 
        books={books} 
        currentUserId={user.id}
        userRole={user.role}
      />
      {showAddButton && (
        <div className="mb-3">
          <Link href="/book/create">
            <Button className="bg-primary hover:bg-primary/90">Add Book</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
// Server Component
import prisma from "@/lib/prisma"; // Adjust to your Prisma setup

export default async function fetchBooks(userId: string, searchParams: { search?: string; page?: string }) {
  const page = Number(searchParams.page) || 1;
  const pageSize = 12;

  return prisma.book.findMany({
    where: {
      userId,
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
}

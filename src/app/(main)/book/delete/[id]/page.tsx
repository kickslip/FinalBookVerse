import { validateRequest } from "@/auth";
import DeleteBookPage from "@/components/Deletebooklanding";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";



export default async function DeleteBookPageWrapper({
  params,
}: {
  params: { id: string };
}) {
  const { user } = await validateRequest();
  if (!user) return notFound();

  const book = await prisma.book.findUnique({
    where: { id: params.id },
  });

  if (!book || book.userId !== user.id) {
    return notFound();
  }

  return <DeleteBookPage book={book} />;
}
'use server';

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { BookValues } from "@/lib/validation";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createBook(values: BookValues) {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized");

  await prisma.book.create({
    data: {
      ...values,
      userId: user.id,
    },
  });

  redirect("/book");
}

export async function updateBook(bookId: string, bookvalues: BookValues) {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized");

  const book = await prisma.book.findUnique({
    where: { id: bookId },
  });

  if (!book || book.userId !== user.id) {
    throw new Error("Not found");
  }

  await prisma.book.update({
    where: { id: bookId },
    data: bookvalues,
  });

  redirect("/book");
}

export async function deleteBook(bookId: string) {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized");

  const book = await prisma.book.findUnique({
    where: { id: bookId },
  });

  if (!book || book.userId !== user.id) {
    throw new Error("Not found");
  }

  await prisma.book.delete({
    where: { id: bookId },
  });

  revalidatePath("/book");
  redirect("/book");
}

export async function getBook(bookId: string): Promise<{
  id: string;
  title: string;
  author: string;
  publishYear: number;
  description: string;
  price: number;
  mediaUrl?: string;
} | null> {
  const { user } = await validateRequest();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const book = await prisma.book.findUnique({
    where: { id: bookId },
  });

  if (!book || book.userId !== user.id) {
    return null;
  }

  return {
    id: book.id,
    title: book.title ?? '',
    author: book.author ?? '',
    publishYear: book.publishYear ?? 0,
    description: book.description ?? '',
    price: book.price ?? 0,
    mediaUrl: book.mediaUrl ?? undefined,
  };
}
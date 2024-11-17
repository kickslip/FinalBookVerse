// app/book/[id]/edit/page.tsx
import  prisma  from '@/lib/prisma';
import { notFound } from 'next/navigation';
import EditBookPage from '@/components/Editbooklanding';
import { validateRequest } from '@/auth';

export default async function EditBookPageWrapper({ params }: { params: { id: string } }) {
  const { user } = await validateRequest();
  if (!user) return notFound();

  const book = await prisma.book.findUnique({
    where: { id: params.id }
  });

  if (!book || book.userId !== user.id) return notFound();

  return <EditBookPage book={book} />;
}
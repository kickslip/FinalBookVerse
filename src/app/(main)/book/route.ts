// app/api/books/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { validateRequest } from '@/auth';

export async function POST(request: Request) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    // Convert price to integer (cents) if it's coming in as a float
    const priceInCents = Math.round(data.price * 100);

    const book = await prisma.book.create({
      data: {
        title: data.title,
        author: data.author,
        description: data.description || null,
        publishYear: data.publishYear,
        price: priceInCents, // Store price in cents
        mediaUrl: data.mediaUrl || null,
        userId: user.id,
      },
    });

    return NextResponse.json(book);
  } catch (error) {
    console.error('Error creating book:', error);
    return NextResponse.json(
      { error: 'Failed to create book' },
      { status: 500 }
    );
  }
}
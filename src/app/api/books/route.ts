// import { NextResponse } from 'next/server';
// import prisma from '@/lib/prisma';
// import { validateRequest } from '@/auth';

// export async function POST(request: Request) {
//   try {
//     const { user } = await validateRequest();
//     if (!user) {
//       console.error('Unauthorized request');
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const data = await request.json();
//     console.log('Received book creation payload:', data);

//     const priceInCents = Math.round(data.price * 100);
//     console.log('Converted price to cents:', priceInCents);

//     const book = await prisma.book.create({
//       data: {
//         title: data.title,
//         author: data.author,
//         description: data.description || null,
//         publishYear: data.publishYear,
//         price: priceInCents,
//         mediaUrl: data.mediaUrl || null,
//         userId: user.id,
//       },
//     });

//     console.log('Book created successfully:', book);
//     return NextResponse.json(book);
//   } catch (error) {
//     console.error('Error creating book:', error);
//     return NextResponse.json({ error: 'Failed to create book' }, { status: 500 });
//   }
// }

// app/api/books/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    // Validate user session
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build the where clause for search
    const where = search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { author: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    // Fetch books with pagination and total count
    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          author: true,
          price: true,
          description: true,
          mediaUrl: true,
          available: true,
          publishYear: true,
        },
      }),
      prisma.book.count({ where }),
    ]);

    return NextResponse.json({
      books,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Add a book to cart
export async function POST(req: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { bookId, quantity = 1 } = await req.json();

    // Verify the book exists and is available
    const book = await prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!book || !book.available) {
      return NextResponse.json(
        { error: "Book not available" },
        { status: 400 }
      );
    }

    // Get or create user's cart
    let cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: { cartItems: true },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: user.id,
          cartItems: {
            create: {
              variationId: bookId,
              quantity,
            },
          },
        },
        include: { cartItems: true },
      });
    } else {
      // Update existing cart item or create new one
      const existingItem = cart.cartItems.find(
        (item) => item.variationId === bookId
      );

      if (existingItem) {
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + quantity },
        });
      } else {
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            variationId: bookId,
            quantity,
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
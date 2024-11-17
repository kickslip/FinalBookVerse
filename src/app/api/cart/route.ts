import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";

// Get cart contents
export async function GET() {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        cartItems: {
          include: {
            book: {
              select: {
                id: true,
                title: true,
                author: true,
                price: true,
                mediaUrl: true,
                available: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ cart });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Add item to cart
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
      // Create new cart with item
      cart = await prisma.cart.create({
        data: {
          userId: user.id,
          cartItems: {
            create: {
              bookId,
              quantity,
            },
          },
        },
        include: {
          cartItems: {
            include: {
              book: true,
            },
          },
        },
      });
    } else {
      // Update existing cart item or create new one
      const existingItem = cart.cartItems.find(
        (item) => item.bookId === bookId
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
            bookId,
            quantity,
          },
        });
      }

      // Fetch updated cart
      cart = await prisma.cart.findUnique({
        where: { userId: user.id },
        include: {
          cartItems: {
            include: {
              book: true,
            },
          },
        },
      });
    }

    return NextResponse.json({ cart });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Update cart item quantity
export async function PATCH(req: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { itemId, quantity } = await req.json();

    if (quantity < 0) {
      return NextResponse.json(
        { error: "Invalid quantity" },
        { status: 400 }
      );
    }

    if (quantity === 0) {
      // Remove item if quantity is 0
      await prisma.cartItem.delete({
        where: { id: itemId },
      });
    } else {
      // Update quantity
      await prisma.cartItem.update({
        where: { id: itemId },
        data: { quantity },
      });
    }

    // Return updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        cartItems: {
          include: {
            book: true,
          },
        },
      },
    });

    return NextResponse.json({ cart: updatedCart });
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Clear cart
export async function DELETE() {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await prisma.cart.delete({
      where: { userId: user.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
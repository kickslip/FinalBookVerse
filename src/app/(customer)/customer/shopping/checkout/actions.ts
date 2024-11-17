"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { OrderStatus, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { FormValues, OrderActionResult } from "./_lib/types";

export async function createOrder(
  formData: FormValues
): Promise<OrderActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return {
        success: false,
        message: "Authentication required",
        error: "Please login to place an order",
      };
    }

    // 1. Verify cart and calculate total
    const existingCart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        cartItems: {
          include: {
            book: true,
          },
        },
      },
    });

    if (!existingCart?.cartItems?.length) {
      return {
        success: false,
        message: "Cart is empty",
        error: "Cannot create order with empty cart",
      };
    }

    // 2. Verify book availability before proceeding
    for (const item of existingCart.cartItems) {
      const book = await prisma.book.findUnique({
        where: { id: item.bookId },
      });

      if (!book || !book.available) {
        return {
          success: false,
          message: "Book unavailable",
          error: `Book ${item.bookId} is currently unavailable`,
        };
      }
    }

    const totalAmount = existingCart.cartItems.reduce(
      (total, item) => total + (item.book.price / 100) * item.quantity,
      0
    );

    // 3. Create order with a transaction
    const order = await prisma.$transaction(
      async (tx) => {
        // Create order
        const newOrder = await tx.order.create({
          data: {
            userId: user.id,
            status: OrderStatus.PENDING,
            totalAmount,
            captivityBranch: formData.captivityBranch,
            methodOfCollection: formData.methodOfCollection,
            salesRep: formData.salesRep || "",
            referenceNumber: formData.referenceNumber || "",
            firstName: formData.firstName,
            lastName: formData.lastName,
            companyName: formData.companyName,
            countryRegion: formData.countryRegion,
            streetAddress: formData.streetAddress,
            apartmentSuite: formData.apartmentSuite || "",
            townCity: formData.townCity,
            province: formData.province,
            postcode: formData.postcode,
            phone: formData.phone,
            email: formData.email,
            orderNotes: formData.orderNotes || "",
            agreeTerms: formData.agreeTerms,
            receiveEmailReviews: formData.receiveEmailReviews,
          },
        });

        // Create order items
        const orderItems = await Promise.all(
          existingCart.cartItems.map((item) =>
            tx.orderItem.create({
              data: {
                orderId: newOrder.id,
                bookId: item.bookId,
                quantity: item.quantity,
                price: item.book.price / 100, // Convert cents to dollars
              },
            })
          )
        );

        // Update book availability if needed
        await Promise.all(
          existingCart.cartItems.map((item) =>
            tx.book.update({
              where: { id: item.bookId },
              data: {
                available: true, // Update this based on your business logic
              },
            })
          )
        );

        // Delete cart items
        await tx.cartItem.deleteMany({
          where: { cartId: existingCart.id },
        });

        return newOrder;
      },
      {
        maxWait: 10000,
        timeout: 20000,
        isolationLevel: "Serializable",
      }
    );

    // 4. Fetch complete order details
    const completeOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        orderItems: {
          include: {
            book: true,
          },
        },
      },
    });

    revalidatePath("/customer/orders");
    revalidatePath("/customer/shopping/cart");

    return {
      success: true,
      message: "Order created successfully",
      data: completeOrder,
    };
  } catch (error) {
    console.error("Error creating order:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2028") {
        return {
          success: false,
          message: "Transaction error",
          error: "Failed to process order. Please try again.",
        };
      }
    }
    return {
      success: false,
      message: "Failed to create order",
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function getOrder(orderId?: string): Promise<OrderActionResult> {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return {
        success: false,
        message: "Authentication required",
        error: "Please login to view order",
      };
    }

    const order = await prisma.order.findFirst({
      where: {
        userId: user.id,
        ...(orderId ? { id: orderId } : {}),
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        orderItems: {
          include: {
            book: true,
          },
        },
      },
    });

    if (!order) {
      return {
        success: false,
        message: "Order not found",
        error: "No orders found",
      };
    }

    return {
      success: true,
      message: "Order retrieved successfully",
      data: order,
    };
  } catch (error) {
    console.error("Error retrieving order:", error);
    return {
      success: false,
      message: "Failed to retrieve order",
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
// src/types/index.ts
export interface Book {
    id: string;
    title: string;
    author: string;
    price: number;
    mediaUrl: string | null;
    available: boolean;
    description?: string | null;
    publishYear?: number | null;
  }
  
  export interface CartItem {
    id: string;
    cartId: string;
    variationId: string; // This is the bookId
    quantity: number;
    book: Book;
  }
  
  export interface Cart {
    id: string;
    userId: string;
    cartItems: CartItem[];
    createdAt: Date;
    updatedAt: Date;
  }
  
  // Add any other shared interfaces here
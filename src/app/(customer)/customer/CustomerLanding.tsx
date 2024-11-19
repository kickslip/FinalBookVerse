"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, LogOut, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "../SessionProvider";
import Header from "./_components/Header";
import { logout } from "@/app/(auth)/actions";
import { useToast } from "@/components/ui/toast/use-toast";
import type { Book, Cart } from "@/types";

interface PaginationData {
  total: number;
  pages: number;
  page: number;
  limit: number;
}

const CustomerLanding = () => {
  const { user } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [books, setBooks] = useState<Book[]>([]);
  const [cart, setCart] = useState<Cart | null>(null);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    pages: 0,
    page: 1,
    limit: 10,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Authorization check
  useEffect(() => {
    if (user && !['ADMIN', 'CUSTOMER'].includes(user.role)) {
      toast({
        title: "Unauthorized",
        description: "You don't have permission to access this page.",
        variant: "error",
      });
      router.push('/login');
    }
  }, [user, router, toast]);

  // Protect the page from unauthorized access
  if (!user || !['ADMIN', 'CUSTOMER'].includes(user.role)) {
    return null; // Prevent flash of content while redirecting
  }

  // Single useEffect for initial data loading
  useEffect(() => {
    let isSubscribed = true;

    const fetchData = async () => {
      if (!isInitialLoad) return;
      
      try {
        setLoading(true);
        const [booksResponse, cartResponse] = await Promise.all([
          fetch(`/api/books?page=1&limit=10`),
          fetch("/api/cart")
        ]);

        const [booksData, cartData] = await Promise.all([
          booksResponse.json(),
          cartResponse.json()
        ]);

        if (!isSubscribed) return;

        if (booksResponse.ok) {
          setBooks(booksData.books);
          setPagination(booksData.pagination);
        }

        if (cartResponse.ok) {
          setCart(cartData.cart);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load data. Please try again later.",
          variant: "error",
        });
      } finally {
        if (isSubscribed) {
          setLoading(false);
          setIsInitialLoad(false);
        }
      }
    };

    fetchData();

    return () => {
      isSubscribed = false;
    };
  }, [isInitialLoad, toast]);

  const handlePageChange = async (newPage: number) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: newPage.toString(),
        limit: "10",
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await fetch(`/api/books?${params}`);
      const data = await response.json();

      if (response.ok) {
        setBooks(data.books);
        setPagination(data.pagination);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch books. Please try again later.",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: "1",
        limit: "10",
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await fetch(`/api/books?${params}`);
      const data = await response.json();

      if (response.ok) {
        setBooks(data.books);
        setPagination({ ...data.pagination, page: 1 });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search books. Please try again later.",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (bookId: string) => {
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, quantity: 1 }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      setCart(data.cart);
      
      toast({
        title: "Success",
        description: "Book added to cart",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add book to cart",
        variant: "error",
      });
    }
  };

  const cartItemCount = cart?.cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  ) || 0;

  // Format price in Rands
  const formatPrice = (priceInCents: number) => {
    return `R${(priceInCents / 100).toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">
              Welcome {user?.displayName || "Guest"}
            </h2>
            <p className="text-muted-foreground">
              Discover your next favorite book
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
            <Input
              type="search"
              placeholder="Search books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Button type="submit" variant="default">
              <Search className="h-4 w-4" />
            </Button>
          </form>

          <div className="flex gap-4">
            <Link href="/cart">
              <Button variant="outline" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-primary">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              {books.map((book) => (
                <Card key={book.id} className="flex flex-col h-full">
                  <CardHeader>
                    <div className="aspect-[2/3] relative mb-2">
                      <img
                        src={book.mediaUrl || "/api/placeholder/200/300"}
                        alt={book.title}
                        className="object-cover rounded-md w-full h-full"
                      />
                    </div>
                    <CardTitle className="text-lg line-clamp-1">{book.title}</CardTitle>
                    <CardDescription>{book.author}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {book.description}
                    </p>
                    {book.publishYear && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Published: {book.publishYear}
                      </p>
                    )}
                  </CardContent>
                  <CardFooter className="mt-auto">
                    <div className="w-full flex items-center justify-between">
                      <span className="text-lg font-semibold">
                        {formatPrice(book.price)}
                      </span>
                      <Button
                        onClick={() => addToCart(book.id)}
                        variant="default"
                        size="sm"
                        disabled={!book.available}
                      >
                        {book.available ? "Add to Cart" : "Out of Stock"}
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {pagination.pages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-6">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                <span className="text-sm">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}

            {books.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  No books found. Try adjusting your search.
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default CustomerLanding;
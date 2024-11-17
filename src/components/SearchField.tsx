"use client";

import { useState } from "react";
import { Input } from "./ui/input"; // Adjust import path
import { SearchIcon } from "lucide-react"; // Adjust import path

export default function SearchField({ searchParams }: { searchParams: { search?: string; page?: string } }) {
  const [books, setBooks] = useState([]);

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const query = (form.elements.namedItem("q") as HTMLInputElement).value;

    try {
      const response = await fetch(`/api/books?search=${query}`);
      const data = await response.json();
      setBooks(data.books);
    } catch (error) {
      console.error("Failed to fetch books:", error);
    }
  };

  return (
    <form onSubmit={handleSearch} method="GET" className="w-full">
      <div className="relative">
        <Input name="q" placeholder="Search" className="pe-10 w-full" />
        <SearchIcon className="absolute right-3 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground" />
      </div>
      <div className="mt-4">
        {books.length > 0 ? (
          books.map((book) => (
            <div key={book.id} className="p-2 border-b">
              <h3 className="text-lg font-bold">{book.title}</h3>
              <p className="text-sm text-gray-600">By {book.author}</p>
              <p className="text-sm">{book.description}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No books found.</p>
        )}
      </div>
    </form>
  );
}
  
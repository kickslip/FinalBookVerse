/* eslint-disable @next/next/no-img-element */
"use client"

import { Book, UserRole } from "@prisma/client";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import Link from "next/link";
import { Eye, Trash2, Pencil, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface BookTableProps {
  books: (Book & {
    user: {
      displayName: string;
      id: string;
    };
  })[];
  currentUserId: string;
  userRole: UserRole;
}

export default function BookTable({ books, currentUserId, userRole }: BookTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 10;

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(books.length / booksPerPage);

  const paginate = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Helper function to determine if user can edit/delete a book
  const canModifyBook = (bookUserId: string) => {
    return userRole === "ADMIN" || bookUserId === currentUserId;
  };

  // Helper function to format price in Rand
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price / 100); // Assuming price is stored in cents
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader className="sticky top-4" >
          <TableRow>
            <TableHead>No.</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Publish Year</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Added By</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentBooks.map((book, index) => (
            <TableRow key={book.id}>
              <TableCell>{index + 1 + (currentPage - 1) * booksPerPage}</TableCell>
              <TableCell>
                {book.mediaUrl ? (
                  <img
                    src={book.mediaUrl}
                    alt={book.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                ) : (
                  <span>No Image</span>
                )}
              </TableCell>
              <TableCell>{book.title}</TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell>{book.description}</TableCell>
              <TableCell>{book.publishYear}</TableCell>
              <TableCell>{formatPrice(book.price)}</TableCell>
              <TableCell>{book.user.displayName}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link 
                    href={`/book/view/${book.id}`}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Eye className="w-4 h-4 text-blue-500" />
                  </Link>
                  {canModifyBook(book.user.id) && (
                    <>
                      <Link 
                        href={`/book/edit/${book.id}`}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <Pencil className="w-4 h-4 text-amber-500" />
                      </Link>
                      <Link 
                        href={`/book/delete/${book.id}`}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Link>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination component remains the same */}
      <div className="flex items-center justify-between px-2 py-3 border rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-sm text-black dark:text-white">
            Showing {indexOfFirstBook + 1} to {Math.min(indexOfLastBook, books.length)} of {books.length} entries
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* First Page */}
          {currentPage > 2 && (
            <>
              <button
                onClick={() => paginate(1)}
                className="px-3 py-1 text-sm rounded-md hover:bg-gray-100"
              >
                1
              </button>
              {currentPage > 3 && <span className="text-gray-500">...</span>}
            </>
          )}

          {/* Current and Adjacent Pages */}
          {Array.from({ length: totalPages }).map((_, index) => {
            const pageNumber = index + 1;
            if (
              pageNumber === currentPage ||
              pageNumber === currentPage - 1 ||
              pageNumber === currentPage + 1
            ) {
              return (
                <button
                  key={pageNumber}
                  onClick={() => paginate(pageNumber)}
                  className={`px-3 py-1 text-sm rounded-md ${
                    currentPage === pageNumber
                      ? "bg-orange-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            }
            return null;
          })}

          {/* Last Page */}
          {currentPage < totalPages - 1 && (
            <>
              {currentPage < totalPages - 2 && (
                <span className="text-gray-500">...</span>
              )}
              <button
                onClick={() => paginate(totalPages)}
                className="px-3 py-1 text-sm rounded-md hover:bg-gray-100"
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
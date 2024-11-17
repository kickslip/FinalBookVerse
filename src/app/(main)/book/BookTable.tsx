/* eslint-disable @next/next/no-img-element */
"use client"

import { Book } from "@prisma/client";
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
  books: Book[];
}

export default function BookTable({ books }: BookTableProps) {
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

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No.</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Publish Year</TableHead>
            <TableHead>Price</TableHead>
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
              <TableCell>ZAR{book.price.toFixed(2)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link 
                    href={`/book/view`}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <Eye className="w-4 h-4 text-blue-500" />
                  </Link>
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
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Custom Pagination */}
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
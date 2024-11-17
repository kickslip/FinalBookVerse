"use client"

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getBook } from './actions';

type BookValues = {
  id: string;
  title: string;
  author: string;
  publishYear: number;
  description: string;
  price: number;
}

const BookSearchPage = () => {
  const [bookId, setBookId] = useState('');
  const [book, setBook] = useState<BookValues | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!bookId.trim()) {
      setError('Please enter a book ID');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const bookData = await getBook(bookId) as BookValues;
      setBook(bookData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch book');
      setBook(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Book Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            <Input
              type="text"
              placeholder="Enter book ID"
              value={bookId}
              onChange={(e) => setBookId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button 
              onClick={handleSearch}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {book && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{book.title}</h3>
                    <p className="text-sm text-gray-500">by {book.author}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">ID</p>
                      <p className="font-mono text-sm">{book.id}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Published</p>
                      <p>{book.publishYear}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Price</p>
                      <p>${book.price.toFixed(2)}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-500">Description</p>
                    <p className="text-sm mt-1">{book.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BookSearchPage;
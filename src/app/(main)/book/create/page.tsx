'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function CreateBookPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [bookData, setBookData] = useState({
    id: '',
    title: '',
    author: '',
    description: '',
    publishYear: '',
    price: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBookData(prev => ({
      ...prev,
      [name]: value,
    }));
    console.log(`Updated field ${name} to:`, value); // Debug log
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      console.log('Selected file:', e.target.files[0]); // Debug log
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // First, upload the image if one is selected
      let mediaUrl = '';
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);

        console.log('Uploading file...'); // Debug log
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          const uploadError = await uploadResponse.text();
          console.error('Upload error:', uploadError); // Debug log
          throw new Error('Failed to upload image');
        }

        const uploadData = await uploadResponse.json();
        console.log('File uploaded successfully:', uploadData); // Debug log
        mediaUrl = uploadData.url;
      }

      // Create the book payload
      const bookPayload = {
        title: bookData.title,
        author: bookData.author,
        description: bookData.description || '',
        publishYear: parseInt(bookData.publishYear),
        price: parseFloat(bookData.price),
        mediaUrl,
      };

      console.log('Sending book payload:', bookPayload); // Debug log
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookPayload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Book creation error:', errorText); // Debug log
        throw new Error(`Failed to create book: ${errorText}`);
      }

      const result = await response.json();
      console.log('Book created successfully:', result); // Debug log

      router.push('/');
      router.refresh();
    } catch (err) {
      console.error('Error in form submission:', err); // Debug log
      setError(err instanceof Error ? err.message : 'Failed to create book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <Button onClick={() => router.back()} className="mb-4" variant="ghost">
        ← Back
      </Button>

      <h1 className="text-3xl font-semibold mb-6">Create New Book</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col border-2 border-orange-500 rounded-xl p-6">
          <div className="space-y-4">
          <div>
              <label htmlFor="Id" className="block text-xl text-gray-500 mb-2">No.</label>
              <input
                id="id"
                name="id"
                type="number"
                required
                value={bookData.id}
                onChange={handleChange}
                className="border-2 border-gray-500 px-4 py-2 w-full rounded focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-xl text-gray-500 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={bookData.title}
                onChange={handleChange}
                className="border-2 border-gray-500 px-4 py-2 w-full rounded focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
            </div>

            {/* Author */}
            <div>
              <label htmlFor="author" className="block text-xl text-gray-500 mb-2">
                Author <span className="text-red-500">*</span>
              </label>
              <input
                id="author"
                name="author"
                type="text"
                required
                value={bookData.author}
                onChange={handleChange}
                className="border-2 border-gray-500 px-4 py-2 w-full rounded focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-xl text-gray-500 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={bookData.description}
                onChange={handleChange}
                className="border-2 border-gray-500 px-4 py-2 w-full rounded focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
            </div>

            {/* Publish Year */}
            <div>
              <label htmlFor="publishYear" className="block text-xl text-gray-500 mb-2">
                Publish Year <span className="text-red-500">*</span>
              </label>
              <input
                id="publishYear"
                name="publishYear"
                type="number"
                required
                value={bookData.publishYear}
                onChange={handleChange}
                className="border-2 border-gray-500 px-4 py-2 w-full rounded focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-xl text-gray-500 mb-2">
                Price <span className="text-red-500">*</span>
              </label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                required
                value={bookData.price}
                onChange={handleChange}
                className="border-2 border-gray-500 px-4 py-2 w-full rounded focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
            </div>

            {/* File Upload */}
            <div>
              <label htmlFor="media" className="block text-xl text-gray-500 mb-2">
                Book Cover Image
              </label>
              <input
                id="media"
                name="media"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="border-2 border-gray-500 px-4 py-2 w-full rounded focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              />
              {selectedFile && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected file: {selectedFile.name}
                </p>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 text-red-500 bg-red-50 rounded">
              {error}
            </div>
          )}

          <div className="flex justify-end items-center space-x-4 mt-6">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Book'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

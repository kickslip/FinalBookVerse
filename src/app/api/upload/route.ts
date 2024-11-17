import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { validateRequest } from '@/auth';

export async function POST(request: Request) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      console.error('Unauthorized request');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      console.error('No file uploaded');
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      console.error('Invalid file type:', file.type);
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
    console.log('Generated filename:', filename);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const imagePath = join(process.cwd(), 'public/uploads', filename);
    console.log('Saving image to:', imagePath);

    await writeFile(imagePath, buffer);

    const imageUrl = `/uploads/${filename}`;
    console.log('Generated URL:', imageUrl);

    return NextResponse.json({ url: imageUrl });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Error uploading file' }, { status: 500 });
  }
}

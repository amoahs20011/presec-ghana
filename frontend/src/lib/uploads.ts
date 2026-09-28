import { auth } from './api';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export interface UploadResponse {
  url: string;
  publicId: string;
}

export async function uploadImage(
  file: File,
  folder = 'misc',
): Promise<UploadResponse> {
  const token = auth.getToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(
    `${API_URL}/uploads/image?folder=${encodeURIComponent(folder)}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    },
  );

  if (!res.ok) {
    let message = 'Upload failed';
    try {
      const err = await res.json();
      message = err.message || message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  return res.json();
}

export async function uploadDocument(
  file: File,
  folder = 'documents',
): Promise<UploadResponse> {
  const token = auth.getToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(
    `${API_URL}/uploads/document?folder=${encodeURIComponent(folder)}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    },
  );

  if (!res.ok) {
    let message = 'Upload failed';
    try {
      const err = await res.json();
      message = err.message || message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  return res.json();
}

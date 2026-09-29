'use client';

import { useRef, useState } from 'react';
import imageCompression from 'browser-image-compression';
import { uploadImage } from '@/lib/uploads';

async function compressImage(file: File): Promise<File> {
  // Skip compression for very small files
  if (file.size < 500 * 1024) return file;

  try {
    const compressed = await imageCompression(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 1600,
      useWebWorker: true,
      initialQuality: 0.8,
    });
    console.log(
      `Image compressed: ${(file.size / 1024).toFixed(0)}KB → ${(
        compressed.size / 1024
      ).toFixed(0)}KB`,
    );
    return compressed;
  } catch (err) {
    console.warn('Compression failed, using original:', err);
    return file;
  }
}

interface ImageUploaderProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  folder?: string;
  label?: string;
  hint?: string;
  shape?: 'circle' | 'square';
  maxSizeMB?: number;
  className?: string;
}

export function ImageUploader({
  value,
  onChange,
  folder = 'misc',
  label = 'Upload image',
  hint,
  shape = 'square',
  maxSizeMB = 5,
  className = '',
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const shapeClass =
    shape === 'circle' ? 'rounded-full' : 'rounded-lg';

    async function handleFile(file: File) {
    setError(null);

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File must be under ${maxSizeMB}MB`);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed');
      return;
    }

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setUploading(true);

    try {
      // Compress first to speed up upload
      const compressed = await compressImage(file);

      const result = await uploadImage(compressed, folder);
      onChange(result.url);
      setPreview(result.url);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setError(msg);
      setPreview(value || null);
    } finally {
      setUploading(false);
      URL.revokeObjectURL(localUrl);
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function onDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(true);
  }

  function onDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
  }

  function clear() {
    setPreview(null);
    onChange(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-semibold text-presec-blue mb-2">
          {label}
        </label>
      )}

      <div
        onClick={() => inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={`
          relative cursor-pointer border-2 border-dashed transition
          ${shapeClass}
          ${dragOver ? 'border-presec-gold bg-yellow-50' : 'border-gray-300 hover:border-presec-blue'}
          ${shape === 'circle' ? 'w-40 h-40 mx-auto flex items-center justify-center' : 'p-6 min-h-[180px] flex items-center justify-center'}
        `}
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            className={`${shapeClass} object-cover w-full h-full`}
          />
        ) : (
          <div className="text-center p-4">
            <div className="text-4xl mb-2">📸</div>
            <div className="text-sm font-medium text-presec-blue">
              Click or drop image here
            </div>
            <div className="text-xs text-gray-500 mt-1">
              JPEG, PNG, WEBP • up to {maxSizeMB}MB
            </div>
          </div>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-black/50 text-white flex items-center justify-center rounded-lg">
            <div className="text-sm font-semibold">Uploading...</div>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onFileChange}
        className="hidden"
      />

      {hint && !error && (
        <p className="text-xs text-gray-500 mt-2">{hint}</p>
      )}

      {error && (
        <p className="text-xs text-red-600 mt-2">{error}</p>
      )}

      {preview && (
        <button
          type="button"
          onClick={clear}
          className="mt-2 text-xs text-red-600 hover:underline"
        >
          Remove image
        </button>
      )}
    </div>
  );
}

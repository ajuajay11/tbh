'use client';

export default function ErrorMessage({ message }: { message?: string | null }) {
  if (!message) return null;

  return (
    <div className="text-red-500 rounded-md text-sm mt-4">
      {message}
    </div>
  );
}
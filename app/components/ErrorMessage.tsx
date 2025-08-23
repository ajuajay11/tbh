'use client';

export default function ErrorMessage({ message }: { message?: string | null }) {
  if (!message) return null;

  return (
    <div className="text-red-500 mt-4 capitalize">
      {message}
    </div>
  );
}
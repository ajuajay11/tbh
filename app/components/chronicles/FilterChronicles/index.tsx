"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  initialFilters: {
    limit: string;
    page: string;
    sort: string;
    country: string;
    search: string;
  };
};


export default function Index({ initialFilters }: Props) {
  const [search, setSearch] = useState(initialFilters.search || "");
  const [country, setCountry] = useState(initialFilters.country || "");
  const [sort, setSort] = useState(initialFilters.sort || "");

  const router = useRouter();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (country) params.set("country", country);
    if (sort) params.set("sort", sort);

    router.push(`/getAllChronicles?${params.toString()}`);
  };
  return (
     <form
  onSubmit={handleSubmit}
  className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-lg p-4 flex flex-col md:flex-row items-center gap-4 mb-8 max-w-2xl mx-auto"
>
  <input
    type="text"
    placeholder="Search"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full md:w-48 px-4 py-2 rounded-lg bg-white/70 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
  />
  <select
    value={country}
    onChange={(e) => setCountry(e.target.value)}
    className="w-full md:w-40 px-4 py-2 rounded-lg bg-white/70 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
  >
    <option value="">All Countries</option>
    <option value="russia">Russia</option>
    <option value="india">India</option>
    <option value="uae">UAE</option>
  </select>
  <select
    value={sort}
    onChange={(e) => setSort(e.target.value)}
    className="w-full md:w-40 px-4 py-2 rounded-lg bg-white/70 text-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-300 transition"
  >
    <option value="">Default Sort</option>
    <option value="mostLiked">Most Liked</option>
    <option value="oldest">Oldest</option>
  </select>
  <button
    type="submit"
    className="px-6 py-2 rounded-lg bg-gradient-to-r from-pink-400 to-violet-400 text-white font-semibold shadow hover:from-pink-500 hover:to-violet-500 transition"
  >
    Apply
  </button>
</form>

  )
}
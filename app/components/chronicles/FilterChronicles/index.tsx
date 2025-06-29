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
     <form onSubmit={handleSubmit}  className="text-black">
      <input
        type="text"
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select value={country} onChange={(e) => setCountry(e.target.value)} className="text-black">
        <option value="">All Countries</option>
        <option value="russia">Russia</option>
        <option value="india">india</option>
        <option value="uae">UAE</option>
      </select>
      <select value={sort} onChange={(e) => setSort(e.target.value)}>
        <option value="">Default Sort</option>
        <option value="mostLiked">Newest</option>
        <option value="oldest">Oldest</option>
      </select>
      <button type="submit">Apply</button>
    </form>
  )
}
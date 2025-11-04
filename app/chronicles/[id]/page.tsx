"use client";
import { getBaseUrl } from "@/lib/getBaseUrl";
import { useState, useEffect } from "react";
import Diary from "../components/Diary";
import NormalNode from "../components/NormalMode";
import Cookies from "js-cookie";
import { Chronicle } from "@/app/types/chronicle";

export default function DiaryTabs({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [tabIndex, setTabIndex] = useState(0);
  const [chronicleDiary, setChronicleDiary] = useState<Chronicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const { id } = await params;
        const token = Cookies.get("token");
        const baseUrl = getBaseUrl();

        const res = await fetch(`${baseUrl}/api/getAllChronicles?id=${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        const data = await res.json();
        console.log("Client:", data);

        if (!res.ok || !data || !data.data?.length) {
          setError(true);
        } else {
          setChronicleDiary(data.data[0]);
        }
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params]);
 
  if (loading)
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <span className="animate-pulse text-gray-400 text-lg">loading...</span>
      </div>
    );
  if (error || !chronicleDiary)
    return (
      <div className="w-full flex h-screen items-center justify-center">
        Post not found
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto mt-12">
      <div className="flex gap-4 mb-4 mt-2 justify-center fixed top-0 left-1/2 -translate-x-1/2 z-50 bg-[#0a0a0a]/80 backdrop-blur-md rounded-full shadow-lg">
        <button
          className={`px-4 py-2 rounded-xl font_two  ${
            tabIndex !== 0 ? "bg-black/60 text-white" : "bg-white/80 text-black"
          }`}
          onClick={() => setTabIndex(0)}
        >
          Normal
        </button>
        <button
          className={`px-4 py-2 rounded-xl font_two ${
            tabIndex !== 1 ? "bg-black/60 text-white" : "bg-white/80 text-black"
          }`}
          onClick={() => setTabIndex(1)}
        >
          Diary
        </button>
      </div>
      <div>
        {tabIndex === 0 ? (
          <NormalNode chronicle={chronicleDiary} />
        ) : (
          <Diary chronicle={chronicleDiary} />
        )}
      </div>
    </div>
  );
}

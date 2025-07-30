'use client';
import { useState, useEffect } from "react";

type Chronicle = {
  yourStoryTitle: string;
  chroniclesOfYou: string;
  incidentFrom: string;
  likeCount: number;
  comments: boolean;
  emailAllowed: boolean;
  user?: {
    firstname: string;
    lastname: string;
    username: string;
  };
};

type Props = {
  chronicle: Chronicle;
};

export default function Diary({ chronicle }: Props) {
  const [slides, setSlides] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (chronicle.chroniclesOfYou.length > 0) {
      const parts: string[] = [];
      for (let i = 0; i < chronicle.chroniclesOfYou.length; i += 1000) {
        parts.push(chronicle.chroniclesOfYou.slice(i, i + 1000));
      }
      setSlides(parts);
    }
  }, [chronicle]);

  const goNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 font-serif">
      <div className="relative max-w-3xl w-full bg-white border-[12px] border-double border-yellow-700 shadow-lg rounded-xl p-6 sm:p-10 before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-6 before:bg-gradient-to-r before:from-[#dfc88e] before:to-[#f3e5ab] before:rounded-t-xl">

        {/* Heading */}
        <h1 className="text-center text-3xl sm:text-4xl font-cursive text-[#5e3d2c] mb-6 tracking-wider">
          {chronicle.yourStoryTitle}
        </h1>

        {/* Page Content */}
        <div className="bg-[#f5e6b3] p-6 rounded-xl border border-yellow-400 shadow-inner text-gray-800 leading-relaxed tracking-wide whitespace-pre-wrap min-h-[200px]">
          {slides[currentIndex]}
        </div>

        {/* Slide Navigation */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="px-4 py-2 bg-yellow-700 text-white rounded disabled:opacity-30"
          >
            Prev
          </button>

          <span className="text-sm text-gray-600"> Page {currentIndex + 1} of {slides.length} </span>

          <button onClick={goNext} disabled={currentIndex === slides.length - 1} className="px-4 py-2 bg-yellow-700 text-white rounded disabled:opacity-30" > Next </button>
        </div>
      </div>
    </div>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import HTMLFlipBook from "react-pageflip";
import Image from "next/image";
import heroImg from "@/public/pexels-phael-2401442.png";

interface Chronicle {
  yourStoryTitle: string;
  chroniclesOfYou: string;
  incidentFrom: string;
  user: string;
  _id: string;
  emailAllowed: string;
  comments: string;
  replyAllowed: string;
}

interface DiaryProps {
  chronicle: Chronicle;
}

const Diary: React.FC<DiaryProps> = ({ chronicle }) => {
  const [splitWords, setSplitWords] = useState<string[]>([]);
  const [isPortrait, setIsPortrait] = useState(true);
  const [dimensions, setDimensions] = useState({ width: 400, height: 600 });
  useEffect(() => {
    const updateDimensions = () => {
      const vh = window.innerHeight;

      if (window.innerWidth < 768) {
        // 📱 Mobile: single-page
        setDimensions({ width: vh * 0.65, height: vh * 0.9 });
        setIsPortrait(true);
      } else if (window.innerWidth < 1280) {
        // 💻 Tablet / small laptop: maybe still single-page
        setDimensions({ width: vh * 0.7, height: vh * 0.9 });
        setIsPortrait(true);
      } else {
        // 🖥️ Desktop: two-page spread
        setDimensions({ width: vh * 0.9, height: vh * 0.9 });
        setIsPortrait(false);
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);
  useEffect(() => {
    if (chronicle?.chroniclesOfYou) {
      // ✅ Split story text every 600 characters (adjust for page size)
      const chunks = chronicle.chroniclesOfYou.match(/.{1,600}/gs) || [];
      setSplitWords(chunks);
    }
  }, [chronicle]);

  if (!chronicle) return <div>No chronicle found</div>;

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-[#111] mx-5">
      <HTMLFlipBook
        width={dimensions.width}
        height={dimensions.height}
        usePortrait={isPortrait}
        size="stretch"
        minWidth={200}
        maxWidth={2000}
        minHeight={400}
        maxHeight={2000}
        showCover={true}
        mobileScrollSupport={true}
        drawShadow={true}
        flippingTime={800}
        clickEventForward={true}
        className="flipbook mx-auto"
      >
        {/* Cover Page */}
        <div className="page-cover relative w-full h-full flex flex-col justify-center items-center text-white font-serif text-center overflow-hidden">
          {/* ✅ Full background image */}
          <Image
            src={heroImg}
            alt="Cover Background"
            fill
            priority
            className="object-cover object-center"
          />

          {/* ✅ Dark overlay for better text contrast */}
          <div className="absolute inset-0 bg-[#980000cc] mix-blend-multiply" />

          {/* ✅ Text content on top */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full p-10">
            <h1 className="text-4xl font-bold mb-4 leading-tight italic">
              {chronicle.yourStoryTitle}
            </h1>
            <p className="italic text-lg"> {chronicle.incidentFrom}</p>
            <p className="pt-10">By : {chronicle.user.firstname} {chronicle.user.lastname}</p>
          </div>
        </div>
        <div className="none lg:block bg-[#fff]"></div>
        {/* Story Pages */}
        {splitWords.map((text: string, i: number) => (
          <div
            key={i}
            className="page bg-[#fffff0] text-[#2d2d2d] font-serif reading-relaxed p-8"
          >
            <p>{text}</p>
          </div>
        ))}
      </HTMLFlipBook>
    </div>
  );
};

export default Diary;

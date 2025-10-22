"use client";
import React, { useState, useEffect } from "react";
import HTMLFlipBook from "react-pageflip";

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

  useEffect(() => {
    if (chronicle?.chroniclesOfYou) {
      // ✅ Split story text every 600 characters (adjust for page size)
      const chunks = chronicle.chroniclesOfYou.match(/.{1,600}/gs) || [];
      setSplitWords(chunks);
    }
  }, [chronicle]);

  if (!chronicle) return <div>No chronicle found</div>;

  return (
    <div className="flex flex-col items-center py-6">
      <h2 className="text-2xl font-semibold mb-6 text-white">
        {chronicle.yourStoryTitle}
      </h2>

      <HTMLFlipBook
        width={550}
        height={733}
        size="stretch"
        minWidth={315}
        maxWidth={1000}
        minHeight={400}
        maxHeight={1533}
        maxShadowOpacity={0.5}
        showCover={true}
        mobileScrollSupport={true}
        className="shadow-2xl"
      >
        {splitWords.map((text, i) => (
          <div
            key={i}
            className="page p-6 bg-[#fffff0] text-[#2d2d2d] font-serif text-lg leading-relaxed"
          >
            <p>{text}</p>
          </div>
        ))}
      </HTMLFlipBook>
    </div>
  );
};

export default Diary;

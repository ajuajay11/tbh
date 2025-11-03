"use client";
import { useState, useEffect, useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import Image from "next/image";
import heroImg from "@/public/pexels-phael-2401442.png";



import { Chronicle } from "@/app/types/chronicle"; // Import Chronicle
interface FlipBookMethods {
  pageFlip: () => { flipNext: () => void; flipPrev: () => void };
}


interface DiaryProps {
  chronicle: Chronicle; // This now uses the imported Chronicle type
}

const Diary: React.FC<DiaryProps> = ({ chronicle }) => {
  const [splitWords, setSplitWords] = useState<string[]>([]);
  const [isPortrait, setIsPortrait] = useState(true);

  const [dimensions, setDimensions] = useState({ width: 400, height: 600 });
  const bookRef = useRef<FlipBookMethods | null>(null);

  useEffect(() => {
    const updateDimensions = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight - 10;

      if (window.innerWidth < 768) {
        // Mobile: Full width and full height
        setDimensions({ width: vw, height: vh });
        setIsPortrait(true);
      } else {
        // Desktop: 600px width centered, with proportional height
        setDimensions({ width: 600, height: vh * 0.85 });
        setIsPortrait(false);
      }
    };

    // Call once on mount
    updateDimensions();

    // Add resize listener
    window.addEventListener("resize", updateDimensions);

    // Cleanup
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);
  // Owner logic


  // Split text logic
  useEffect(() => {
    if (chronicle?.chroniclesOfYou) {
      const chunks = chronicle.chroniclesOfYou.match(/[\s\S]{1,600}/g) || [];
      setSplitWords(chunks);
    }
  }, [chronicle]);

  const handleCoverDoubleClick = () => {
    if (bookRef.current) {
      bookRef.current?.pageFlip().flipNext();
    }
  };
  if (!chronicle) return <div>No chronicle found</div>;
  return (
    <>
      <div style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#000004" }} >
        <div
          style={{
            width: dimensions.width,
            maxWidth: "1100px",
            margin: "0 auto",
            transition: "width 0.2s",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            background: "#000004",
          }}
        >
          <HTMLFlipBook
            ref={bookRef}
            width={dimensions.width}
            height={dimensions.height}
            minWidth={320}
            maxWidth={1100}
            minHeight={460}
            maxHeight={1200}
            size="fixed"
            showCover={false}
            drawShadow={true}
            flippingTime={1000}
            maxShadowOpacity={0.18}
            className="flipbook mx-auto rounded-xl shadow-2xl"
            style={{ width: "100%" }}
            startPage={0}
            usePortrait={isPortrait}
            startZIndex={0}
            autoSize={true}
            clickEventForward={true}
            useMouseEvents={true}
            swipeDistance={30}
            showPageCorners={true}
            disableFlipByClick={false}
            mobileScrollSupport={true}
          >
            {/* Cover */}
            <div
              onClick={(e) => e.stopPropagation()}
              onDoubleClick={handleCoverDoubleClick}
              style={{ cursor: "pointer" }}
              className="page-cover relative w-full h-full flex flex-col justify-center items-center text-white font-serif text-center overflow-hidden rounded-xl"
            >
              <Image
                src={heroImg}
                alt="Cover Background"
                fill
                priority
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-[#980000bb] mix-blend-multiply" />
              <div className="relative z-10 flex flex-col items-center justify-center h-full p-10">
                <h1 className="text-4xl font-bold mb-4 leading-tight italic drop-shadow-lg">
                  {chronicle.yourStoryTitle}
                </h1>
                <p className="italic text-lg drop-shadow-md">
                  {chronicle.incidentFrom}
                </p>
                <p className="pt-10 text-sm opacity-90">
                  By: {chronicle.user?.firstname || "Unknown"}{" "}
                  {chronicle.user?.lastname || ""}
                </p>
              </div>
            </div>
            {/* Story Pages */}
            {splitWords.map((text, i) => (
              <div
                key={i}
                className="page bg-[#fffbea] text-[#232323] font-serif leading-relaxed p-8 text-justify rounded-xl"
                style={{
                  boxShadow:
                    "inset 16px 0 32px -22px #b1a991, 2px 0 8px 2px rgba(41,41,41,0.075)",
                }}
              >
                <p>{text}</p>
              </div>
            ))}
          </HTMLFlipBook>
        </div>
      </div>


    </>
  );
};

export default Diary;

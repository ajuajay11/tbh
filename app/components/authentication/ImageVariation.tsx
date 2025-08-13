'use client'
import { useEffect, useState } from "react"
import pImage from "../../../public/pexels-phael-2401442.png";
import pImageOne from "../../../public/openeyes.png";
import Image from "next/image";

export default function ImageVariation() {
  const [eyes, setEyes] = useState<boolean>(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setEyes(true);
    }, 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Closed eyes image */}
      <Image
        src={pImageOne}
        alt="Profile preview closed eyes"
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        className={`object-cover transition-opacity duration-700 ease-out ${
          eyes ? "opacity-0" : "opacity-100"
        }`}
        priority
      />
      
      {/* Open eyes image */}
      <Image
        src={pImage}
        alt="Profile preview open eyes"
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        className={`object-cover transition-opacity duration-700 ease-out ${
          eyes ? "opacity-100" : "opacity-0"
        }`}
        priority
      />
    </div>
  );
}
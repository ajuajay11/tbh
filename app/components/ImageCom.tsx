"use client";
import React, { useEffect, useState } from "react";
import styles from "../Homepage/Homepage.module.css";
import heroImgTwo from "@/public/saymynametwo.png";
import heroImg from "@/public/pexels-phael-2401442.png";
import { usePathname } from "next/navigation";

export default function withImageCom<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  const ImageComWrapper = (props: P) => {
    const [loadedSecond, setLoadedSecond] = useState(false);
    const pathname = usePathname();

    // Step 1: Preload the second image without blocking UI
    useEffect(() => {
      const img = new Image();
      img.src = heroImg.src;

      img.onload = () => {
        // fade only after image is fully downloaded
        setLoadedSecond(true);
      };
    }, []);

    const contentClass =
      pathname === "/dashboard" || pathname === "/dashboard/write-chronicle"
        ? `${styles.content} w-full lg:w-[50%] items-start h-full lg:top-20`
        : `${styles.content}`;

    return (
      <div className={`${styles.wrapper} min-h-screen flex justify-center items-center lg:justify-end lg:items-center`}>
        
        {/* FIRST IMAGE (immediately visible) */}
        <div
          className={`${styles.bg} ${!loadedSecond ? styles.visible : styles.hidden}`}
          style={{ backgroundImage: `url(${heroImgTwo.src})` }}
        />

        {/* SECOND IMAGE (fades in AFTER loading) */}
        <div
          className={`${styles.bg} ${loadedSecond ? styles.visible : styles.hidden}`}
          style={{ backgroundImage: `url(${heroImg.src})` }}
        />

        {/* CONTENT */}
        <div className={contentClass}>
          <WrappedComponent {...props} />
        </div>
      </div>
    );
  };

  ImageComWrapper.displayName = `withImageCom(${WrappedComponent.displayName || "Component"})`;
  return React.memo(ImageComWrapper);
}

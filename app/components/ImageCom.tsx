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
    const [showSecond, setShowSecond] = useState(false);
    const pathname = usePathname(); // ✅ current route

    useEffect(() => {
      const timer = setTimeout(() => {
        setShowSecond(true);
      }, 2000);
      return () => clearTimeout(timer); 
    }, []);
    const contentClass = pathname === "/dashboard" || pathname === "/dashboard/write-chronicle" ? `${styles.content} w-full lg:w-[50%] items-start h-full lg:top-20` : `${styles.content}`;
    return (
      <div className={`${styles.wrapper} h-screen flex justify-center items-center lg:justify-end lg:items-center`} >
        <div className={`${styles.bg} ${!showSecond ? styles.visible : styles.hidden  }`}
          style={{ backgroundImage: `url(${heroImgTwo.src})` }}
        />
        <div className={`${styles.bg} ${showSecond ? styles.visible : styles.hidden }`}
          style={{ backgroundImage: `url(${heroImg.src})` }}
        />
        <div className={`${styles.content, contentClass}`}>
          <WrappedComponent {...props} />
        </div>
      </div>
    );
  };

  const wrappedName =
    WrappedComponent.displayName || WrappedComponent.name || "Component";
  ImageComWrapper.displayName = `withImageCom(${wrappedName})`;
  return React.memo(ImageComWrapper);
}

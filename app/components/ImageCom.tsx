'use client'
import React, { useEffect, useState } from "react";
import styles from "../Homepage/Homepage.module.css";
import heroImgTwo from "@/public/saymynametwo.png";
import heroImg from "@/public/pexels-phael-2401442.png";

export default function withImageCom<P extends object>( WrappedComponent: React.ComponentType<P> ) {
  const ImageComWrapper = (props: P) => {
    const [showSecond, setShowSecond] = useState(false);
    useEffect(() => {
      const timer = setTimeout(() => {
        setShowSecond(true);
      }, 2000);
      return () => clearTimeout(timer);
    }, []);

    return (
      <div className={`${styles.wrapper} h-screen flex justify-center lg:justify-end items-center`}>
        <div className={`${styles.bg} ${!showSecond ? styles.visible : styles.hidden}`} style={{ backgroundImage: `url(${heroImgTwo.src})` }} />
        <div className={`${styles.bg} ${showSecond ? styles.visible : styles.hidden}`} style={{ backgroundImage: `url(${heroImg.src})` }} />
         
        <div className={`${styles.content}`}>
            <WrappedComponent {...props} />
        </div>
      </div>
    );
  };

  const wrappedName = WrappedComponent.displayName || WrappedComponent.name || "Component"; ImageComWrapper.displayName = `withImageCom(${wrappedName})`;
  return React.memo(ImageComWrapper);
}

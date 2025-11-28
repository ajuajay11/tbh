"use client";

import { useEffect } from "react";

export default function GlobalAOS() {
  useEffect(() => {
    async function loadAOS() {
      const AOS = (await import("aos")).default;
      AOS.init({
        duration: 600,
        once: true,
      });
    }

    // Delay AOS JS load by 1 second
    const timer = setTimeout(loadAOS, 1000);

    return () => clearTimeout(timer);
  }, []);

  return null;
}

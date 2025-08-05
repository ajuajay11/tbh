'use client';

import { useEffect } from "react";
import AOS from "aos";
 
export default function AosInit() {
  useEffect(() => {
          AOS.init({
              duration: 1000,
              once: true,
          });
          AOS.refresh();
    }, []);

  return null;
}
 
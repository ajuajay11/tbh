'use client'
import { useEffect, useState } from "react"
import pImage from "../../../public/pexels-phael-2401442.png";
import pImageOne from "../../../public/openeyes.png";
import Image from "next/image";

export default function ImageVariation() {
   const [eyes, setEyes] = useState<boolean>(false);
   useEffect(() => {
      setTimeout(() => {
        setEyes(true)
      }, 2000);
   }, [])
   
  return (
    <>
    {eyes ? <Image src={pImage} alt="Profile preview" className="object-cover w-100 h-full" /> : <Image src={pImageOne} alt="Profile preview" className="object-cover w-100 h-full" />}
    </>
  )
}

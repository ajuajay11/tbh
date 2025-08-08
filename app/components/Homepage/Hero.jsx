'use client';

import Image from "next/image";
import pImage from "../../../public/pexels-phael-2401442.png";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import AOS from "aos";


export default function Hero() {
     
    const router = useRouter()
    const [showImage, setShowImage] = useState(false);
    const [email, setEmail] = useState("");
    const emailRegistration = (e) => {
        e.preventDefault();
        if (email) {
router.push('/login');
        }
    }
     useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });
        AOS.refresh();
  }, []);
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowImage(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="lg:h-screen w-full overflow-hidden flex justify-center">
             <div className="flex flex-col md:flex-row h-full w-full max-w-[1600px]">
                 {showImage && (
                    <div data-aos="fade-in" className="hidden md:block w-full md:w-1/3 h-64 md:h-full"  >
                       <Image src={pImage} alt="Profile preview" className="object-cover w-full h-full" />
                    </div>
                )}
                 <div className=" bg-[#030303] text-center text-white flex flex-col items-center justify-center gap-4 px-4" >
                    <div className="demo-section">
                        <h1 className="hero-text text-3xl sm:text-4xl md:text-5xl font-bold">  Share Your Story. <br />
                            <span className="btn-shine-alt">Anonymously. Fearlessly.</span>
                        </h1>
                    </div>
                    <p className="text-lg text-gray-300 max-w-md"> Confessions, secrets, thoughts — your voice matters. Read or share without judgment. </p>
                     <div className="w-full max-w-xl mx-auto mt-3 px-4">
                        <form onSubmit={emailRegistration} className="flex flex-col sm:flex-row items-center gap-2 w-full" >
                            <input required value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Enter your email" className="w-full px-4 py-3 rounded-null text-white bg-black border border-[#333646] focus:outline-none" />
                            <button type="submit" className="tbh_button w-full sm:w-auto px-4 py-3 whitespace-nowrap" > Submit </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

    );
}

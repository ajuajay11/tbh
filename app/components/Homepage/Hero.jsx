'use client';

import Image from "next/image";
import pImage from "../../../public/pexels-phael-2401442.png";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import AOS from "aos";

export default function Hero() {
    const router = useRouter();
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

    // Fix: Convert Next.js Image import to string URL
    const backgroundStyle = showImage ? {
        backgroundImage: `url(${pImage.src})`, // Add .src for Next.js Image import
        backgroundSize: 'contain',
        backgroundPosition: 'center left',
        backgroundRepeat: 'no-repeat'
    } : {};

    return (
        <div className="h-screen w-full overflow-hidden flex justify-center">
            <div 
                className="flex flex-col md:flex-row justify-center h-full w-full max-w-[1600px] relative"
                style={backgroundStyle}
            >
                {/* Overlay for better text readability */}
                {showImage && (
                    <div className="absolute inset-0 bg-black bg-opacity-40 md:bg-opacity-0 md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-black"></div>
                )}
                
                <div className={`${showImage ? 'md:w-2/3 md:ml-auto' : 'w-full'} lg:bg-[#030303] md:bg-opacity-90 text-center text-white flex flex-col items-center justify-center gap-4 px-4 relative z-10`}>
                    <div className="demo-section" data-aos="fade-up">
                        <h1 className="hero-text  font_one font-bold">
                            Share Your Story. <br />
                            <span className="btn-shine-alt">Anonymously. Fearlessly.</span>
                        </h1>
                    </div>
                    
                    <p data-aos="fade-up" className="text-lg text-gray-300 max-w-md">
                        Confessions, secrets, thoughts — your voice matters. Read or share without judgment.
                    </p>
                    
                    <div className="w-full max-w-xl mx-auto mt-3 px-4" data-aos="zoom-in">
                        <form onSubmit={emailRegistration} className="flex flex-col sm:flex-row items-center gap-2 w-full">
                            <input 
                                required 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                type="email" 
                                placeholder="Enter your email" 
                                className="w-full px-4 py-3 rounded-lg sm:rounded-l-lg sm:rounded-r-none text-white bg-black bg-opacity-80 border border-[#333646] focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors" 
                            />
                            <button 
                                type="submit" 
                                className="tbh_button w-full sm:w-auto px-4 py-3 whitespace-nowrap rounded-lg sm:rounded-l-none sm:rounded-r-lg"
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
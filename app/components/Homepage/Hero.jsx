'use client';
import Image from "next/image";
import pImage from "../../../public/pexels-phael-2401442.png";
import pImageOne from "../../../public/openeyes.png";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import AOS from "aos";

// ImageVariation Component
function ImageVariation() {
  const [eyes, setEyes] = useState(false);

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

export default function Hero() {
    const router = useRouter();
    const [showImage, setShowImage] = useState(false);
    const [email, setEmail] = useState("");
         
    const emailRegistration = (e) => {
        e.preventDefault();
        if (email) {
           router.push(`/register?e=${encodeURIComponent(email)}`)
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
        <div className="h-screen w-full overflow-hidden flex justify-center">
            <div className="flex flex-col md:flex-row justify-center h-full w-full max-w-[1600px] relative">
                
                {/* Left side - Image Section */}
                <div className="w-full md:w-1/2 lg:w-1/2 relative">
                    <div className={`w-full h-full transition-all duration-1000 ease-out ${
                        showImage ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    }`}>
                        <ImageVariation />
                    </div>
                    
                    {/* Optional overlay for better text contrast on mobile */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent md:hidden"></div>
                </div>

                {/* Right side - Content Section */}
                <div className="w-full md:w-1/2 lg:w-1/2 flex items-center justify-center px-6 lg:px-12 relative">
                    {/* Content goes here */}
                    <div className="max-w-lg w-full">
                        {/* Hero Text */}
                        <div data-aos="fade-up" data-aos-delay="300">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-400 mb-6">
                                Share Your Story. <br />
                            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Anonymously. Fearlessly. 
                                </span>
                            </h1>
                            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
                                Discover amazing experiences and connect with like-minded people. Start your adventure today.
                            </p>
                        </div>

                        {/* Email Registration Form */}
                        <div data-aos="fade-up" data-aos-delay="500">
                            <form onSubmit={emailRegistration} className="space-y-4">
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email address"
                                        className="w-full px-6 py-4 text-lg border-2 rounded-lg border-gray-200 focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl text-lg"
                                >
                                    Get Started
                                </button>
                            </form>
                        </div>

                        {/* Additional CTA or features */}
                        <div data-aos="fade-up" data-aos-delay="700" className="mt-12">
                            <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Free to join
                                </div>
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    No spam
                                </div>
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Secure
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
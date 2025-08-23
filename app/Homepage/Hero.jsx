'use client';
import { useState } from "react";
import { useRouter } from 'next/navigation';
import ImageCom from "../components/ImageCom";
import style from "./Homepage.module.css";

function Hero() {
    const router = useRouter();
    const [email, setEmail] = useState("");

    const emailRegistration = (e) => {
        e.preventDefault();
        if (email) {
            router.push(`/register?e=${encodeURIComponent(email)}`)
        }
    }

    return (
        <>
            <section className="p-5">
                <div data-aos="fade-up">
                    <h1 className="font_one"> Share Your Story. <br />
                        <span className={`${style.gradient_text}`}>Anonymously. Fearlessly. </span>
                    </h1>
                    <p className="text-gray-400 mb-8"> Discover amazing experiences and connect with like-minded people. Start your adventure today. </p>
                </div>
                <form onSubmit={emailRegistration} className="flex gap-2">
                    <input className="lg:w-[50%] p-3 customBox" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email address" required />
                    <button type="submit" className="no-wrap tbh_button"> Get Started </button>
                </form>
            </section>

        </>
    );
}

export default ImageCom(Hero);

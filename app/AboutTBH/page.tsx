 import { TextReveal } from "@/app/components/magicui/text-reveal";
export const metadata = {
  title: "About TBH | To Be Honest",
  description:
    "TBH (To Be Honest) is a safe space for sharing real, raw, honest stories—anonymous or not. Join a community built on emotion, truth, and connection.",
  keywords: [
    "TBH",
    "To Be Honest",
    "anonymous stories",
    "real stories",
    "share your thoughts",
    "emotional platform",
    "anonymous community",
  ],
  robots: "index, follow",
  openGraph: {
    title: "About TBH | To Be Honest",
    description:
      "A safe space to express your honest stories, thoughts, and emotions anonymously or publicly.",
    url: "https://yourdomain.com/about",
    siteName: "TBH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About TBH | To Be Honest",
    description:
      "Share your truth, connect emotionally, and express yourself freely on TBH.",
  },
};
export default function AboutTBH() {
  return (
    <>
    <div className="" style={{height:"40px"}}> </div> 
      <TextReveal>Welcome to TBH - To Be Honest, your safe space to share your real, raw stories—whether it’s a quiet thought, a heavy memory, or a funny moment that makes you you. 😄 We’re here for the introverts, the dreamers, and anyone carrying a past they want to express, anonymously or not. TBH is all about connecting hearts through honesty, with no judgment—just likes, comments, and vibes that say, “We get you.” 💪 Join us to share your truth, heal, and build a community where every story matters. That’s the TBH way! 🚀</TextReveal>
    </>
  )
}
 
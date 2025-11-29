 

import Link from "next/link";
import { UndoDot } from 'lucide-react';
export const metadata = {
  title: "Why TBH? | To Be Honest",
  description:
    "Discover why TBH (To Be Honest) exists — a safe, anonymous platform for sharing your deepest thoughts, emotions, and real-life stories without judgment.",
  keywords: [
    "TBH",
    "To Be Honest",
    "Why TBH",
    "anonymous stories",
    "mental health sharing",
    "emotional support",
    "share your story",
  ],
  robots: "index, follow",
  openGraph: {
    title: "Why TBH? | To Be Honest",
    description:
      "TBH is a safe space to express your emotions, thoughts, and real stories — anonymously or openly.",
    url: "https://yourdomain.com/why-tbh",
    siteName: "TBH",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Why TBH? | To Be Honest",
    description:
      "A platform where your feelings matter. Share your truth without fear.",
  },
};
export default function WhyTbh() {
  return (
    <>
    <Link className="p-10 flex items-center" href="/">
      <UndoDot />&nbsp;back
    </Link>
    <section className="max-w-3xl mx-auto px-6 pb-12 text-center text-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-white">Why TBH?</h1>

      <p className="text-lg leading-relaxed mb-4">
        Are you struggling silently? Do you feel alone — like you have thoughts,
        emotions, or stories that no one would understand? Do you ever wish you
        could just speak your heart out without showing your face, without being
        judged, without being labeled?
      </p>

      <p className="text-lg leading-relaxed mb-4">
        <strong>TBH (To Be Honest)</strong> was created for you.
      </p>

      <p className="text-lg leading-relaxed mb-4">
        In a world that constantly demands perfection, TBH is a space where you
        can simply <strong>be human</strong>. A space to share your thoughts,
        pain, memories, and feelings — openly or anonymously. Whether it’s
        something that’s been hurting you, something you’re proud of, or
        something you’ve never told anyone… here, you can finally let it out.
      </p>

      <p className="text-lg leading-relaxed mb-4">
        No filters. No followers. No pressure.
      </p>

      <p className="text-lg leading-relaxed mb-4">
        TBH isn’t about popularity — it’s about{" "}
        <strong>honesty and healing</strong>. You can post as yourself or behind
        a mask — because your words matter more than your face. Every story
        shared here stays protected. Your identity, your privacy, your emotions
        — all are <strong>secure and confidential</strong>. No one will ever
        know who you are unless you choose to reveal it. Your story will be seen
        only as an <strong>anonymous voice</strong>, speaking truth in a world
        full of noise.
      </p>

      <p className="text-lg leading-relaxed mb-4">
        At TBH, we believe that <strong>everyone deserves to be heard</strong>,
        without fear, shame, or judgment. We only ask one thing: share your
        truth with kindness. No hate, no bad words — just real stories, real
        emotions, and real people trying to heal and connect.
      </p>

      <p className="text-lg leading-relaxed">
        Because sometimes, being honest — even behind a mask — can be the most
        powerful thing you ever do.
      </p>
    </section>
    </>
  );
}

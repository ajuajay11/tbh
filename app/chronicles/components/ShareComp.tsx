"use client";
import { usePathname } from "next/navigation"; // ✅ Import this

interface ShareProps {
  Pid: string;
  Title: string;
}

export default function ShareComp({ Pid, Title }: ShareProps) {
    const pathname = usePathname(); // ✅ Get the current route

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: Title,
          text: "Check this out!",
          url: `https://www.tobehonest.club/chronicles/${Pid}`,
        });
      } catch (error) {
        console.log("Share cancelled or failed:", error);
      }
    } else {
      alert("Sharing not supported on this device. Copy the link instead.");
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`${pathname=='/chronicles' ? 'bg-[#fffff0]' : ''} p-3 text-[#a1a1a1] rounded-full shadow-lg`}
    >
      🔗
    </button>
  );
}

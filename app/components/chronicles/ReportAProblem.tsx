'use client';
import axios from "axios";
import { FormEvent, useState, useRef, useEffect } from "react";
import Cookies from "js-cookie";
// import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'; // Example icon import

interface MyComponentProps {
  Pid: string
}

export default function ReportAProblem({ Pid }: MyComponentProps) {
  const token = Cookies.get('token');
  const [getReason, setgetReason] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setModalOpen(false);
      }
    }
    if (modalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [modalOpen]);

  const submitReport = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post(`/api/addChronicles/${Pid}/add-report/`, {
        reason: getReason
      }, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        }
      });
      setModalOpen(false);
      setgetReason("");
      // Optionally show a toast or confirmation here
    } catch (error) {
      console.error(error);
      
      // Handle error, show message if needed
    }
  };

  return (
    <>
      {/* Report Icon */}
      <button  aria-label="Report" className="text-pink-400 hover:text-pink-600 transition"  onClick={() => setModalOpen(true)}  type="button" >
         <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
        </svg>
      </button>

      {/* Popup Modal */}
      {modalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div ref={popupRef} className="backdrop-blur-lg bg-white/10 border border-white/30 rounded-2xl shadow-2xl p-6 w-80 relative" >
      <button  className="absolute top-2 right-3 text-white/70 hover:text-pink-400 text-xl" onClick={() => setModalOpen(false)} aria-label="Close" type="button" >×</button>
      <form onSubmit={submitReport} className="space-y-4">
        <label htmlFor="report" className="block text-white font-semibold mb-2">  Report this post </label>
        <select id="report" value={getReason} onChange={(e) => setgetReason(e.target.value)} required className="w-full p-2 rounded-lg bg-white/80 text-black focus:outline-none focus:ring-2 focus:ring-pink-300">
          <option value="">Select a reason</option>
          <option value="sexualContent">Sexual Content</option>
          <option value="abuse">Abuse or Harassment</option>
          <option value="spam">Spam or Scam</option>
          <option value="hateSpeech">Hate Speech</option>
          <option value="violence">Violence or Threats</option>
          <option value="misinformation">Misinformation</option>
          <option value="other">Other</option>
        </select>
        <button type="submit" className="w-full bg-gradient-to-r from-pink-400 to-violet-400 text-white font-semibold py-2 rounded-lg shadow hover:from-pink-500 hover:to-violet-500 transition" > Submit Report  </button>
      </form>
    </div>
  </div>
)}

    </>
  );
}

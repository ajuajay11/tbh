'use client';
import axios from "axios";
import { FormEvent, useState, useRef, useEffect } from "react";
import Cookies from "js-cookie";
import { Flag } from 'lucide-react';
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
 
    }
  };

  return (
    <>
      {/* Report Icon */}
      <button aria-label="Report" className="p-1 text-[#fff]" onClick={() => setModalOpen(true)} type="button" >
        <Flag className="w-5 h-5 group-hover:text-yellow-400 transition-colors" />
      </button>

      {/* Popup Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div ref={popupRef} className="backdrop-blur-lg border border-white/30 p-6 w-80 relative" >
            <button className="absolute top-2 right-3 text-white/70 hover:text-pink-400 text-xl" onClick={() => setModalOpen(false)} aria-label="Close" type="button" >×</button>
            <form onSubmit={submitReport} className="space-y-4">
              <label htmlFor="report" className="block text-white font-semibold mb-2">  Report this post </label>
              <select id="report" value={getReason} onChange={(e) => setgetReason(e.target.value)} required className="w-full px-3 py-2 backdrop-blur-lg bg-black/40 text-white focus:outline-none  ">
                <option value="">Select a reason</option>
                <option value="sexualContent">Sexual Content</option>
                <option value="abuse">Abuse or Harassment</option>
                <option value="spam">Spam or Scam</option>
                <option value="hateSpeech">Hate Speech</option>
                <option value="violence">Violence or Threats</option>
                <option value="misinformation">Misinformation</option>
                <option value="other">Other</option>
              </select>
              <button type="submit" className="w-full bg-gradient-to-br from-red-600 to-red-500 text-white font-semibold py-2 rounded-lg shadow transition" > Submit Report  </button>
            </form>
          </div>
        </div>
      )}

    </>
  );
}
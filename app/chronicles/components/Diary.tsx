"use client";
import { useState, useEffect, ChangeEvent, FormEvent, useRef } from "react";
import HTMLFlipBook from "react-pageflip";
import Image from "next/image";
import heroImg from "@/public/pexels-phael-2401442.png";
import ErrorMessage from "@/app/components/ErrorMessage";
import { getBaseUrl } from "@/lib/getBaseUrl";
import SuccessMsg from "@/app/components/SuccessMsg";
import Styles from "../../dashboard/dashboard.module.css";
import { countries } from "@/lib/Countries";
import axios from "axios";
import Cookies from "js-cookie";
import { createPortal } from "react-dom";
import { Chronicle } from "@/app/types/chronicle"; // Import Chronicle
interface FlipBookMethods {
  pageFlip: () => { flipNext: () => void; flipPrev: () => void };
}

interface ChronicleFormData {
  yourStoryTitle: string;
  chroniclesOfYou: string;
  incidentFrom: string;
  emailAllowed: boolean;
  comments: boolean;
  replyAllowed: boolean;
}

interface DiaryProps {
  chronicle: Chronicle; // This now uses the imported Chronicle type
}

const Diary: React.FC<DiaryProps> = ({ chronicle }) => {
  const [splitWords, setSplitWords] = useState<string[]>([]);
  const [isPortrait, setIsPortrait] = useState(true);
  const [isEditable, setEditable] = useState(false);
  const token = Cookies.get("token");
  const [isOwner, setIsOwner] = useState(false);
  const [addChronicle, setAddChronicle] = useState<ChronicleFormData>({
    yourStoryTitle: chronicle.yourStoryTitle,
    chroniclesOfYou: chronicle.chroniclesOfYou,
    replyAllowed: chronicle.replyAllowed,
    emailAllowed: chronicle.emailAllowed,
    comments: chronicle.comments,
    incidentFrom: chronicle.incidentFrom,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 400, height: 600 });
  const [openModal, setOpenModal] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const bookRef = useRef<FlipBookMethods | null>(null);

  useEffect(() => {
    const updateDimensions = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight - 10;

      if (window.innerWidth < 768) {
        // Mobile: Full width and full height
        setDimensions({ width: vw, height: vh });
        setIsPortrait(true);
      } else {
        // Desktop: 600px width centered, with proportional height
        setDimensions({ width: 600, height: vh * 0.85 });
        setIsPortrait(false);
      }
    };

    // Call once on mount
    updateDimensions();

    // Add resize listener
    window.addEventListener("resize", updateDimensions);

    // Cleanup
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);
  // Owner logic
  useEffect(() => {
    const userId = Cookies.get("userId");
    setIsOwner(userId === chronicle.user?._id);
  }, [chronicle.user?._id]);

  // Split text logic
  useEffect(() => {
    if (chronicle?.chroniclesOfYou) {
      const chunks = chronicle.chroniclesOfYou.match(/[\s\S]{1,600}/g) || [];
      setSplitWords(chunks);
    }
  }, [chronicle]);

  const handleCoverDoubleClick = () => {
    if (bookRef.current) {
      bookRef.current?.pageFlip().flipNext();
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setAddChronicle((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const doEditable = () => {
    setEditable((e) => !e);
  };

  const submitChronicle = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(
        `${getBaseUrl()}/api/addChronicles/${chronicle._id}`,
        addChronicle,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        const successMsg = response?.data?.message;
        setSuccess(successMsg);
      }
    } catch (err: unknown) {
      let message = "Unexpected error";
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || err.message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const DeleteAccFn = async () => {
    try {
      const res = await axios.delete(
        `${getBaseUrl()}/api/addChronicles/${chronicle._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.status === 200) {
        const successMsg = res?.data?.message;
        setSuccess(successMsg);
        window.location.href = "/dashboard";
      }
    } catch (err) {
      let message = "Unexpected error";
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || err.message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!chronicle) return <div>No chronicle found</div>;

  return (
    <>
      <SuccessMsg successMsg={success} />
      {isOwner && (
        <div className="flex justify-center gap-3">
          <button
            className="tbh_button px-6 py-2 rounded-lg transition-all hover:scale-105"
            onClick={doEditable}
          >
            {isEditable ? "Cancel" : "Edit"}
          </button>
          <button
            className="tbh_button px-6 py-2 rounded-lg transition-all hover:scale-105"
            onClick={() => setOpenModal((prev) => !prev)}
          >
            Delete
          </button>
        </div>
      )}

      {isEditable ? (
        <section className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-2xl">
            <SuccessMsg successMsg={success} />
            <form
              onSubmit={submitChronicle}
              className={`${Styles.my_profile} ${Styles.glass_card} w-full p-6`}
            >
              <div className="my-5">
                <label
                  htmlFor="yourStoryTitle"
                  className="block mb-2 text-lg font-semibold capitalize"
                >
                  Title
                </label>
                <input
                  type="text"
                  name="yourStoryTitle"
                  value={addChronicle.yourStoryTitle}
                  onChange={handleChange}
                  placeholder="Enter your story title"
                  className="w-full rounded-lg p-3 outline-none border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  required
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="chroniclesOfYou"
                  className="block mb-2 text-lg font-semibold capitalize"
                >
                  Chronicles Of You
                </label>
                <textarea
                  required
                  name="chroniclesOfYou"
                  value={addChronicle.chroniclesOfYou}
                  onChange={handleChange}
                  placeholder="Share your story..."
                  className="w-full rounded-lg p-3 border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all placeholder-gray-400 resize-none"
                  rows={10}
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="incidentFrom"
                  className="block mb-2 text-lg font-semibold capitalize"
                >
                  Incident From
                </label>
                <select
                  name="incidentFrom"
                  required
                  id="incidentFrom"
                  value={addChronicle.incidentFrom}
                  onChange={handleChange}
                  className="w-full rounded-lg p-3 border border-gray-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                >
                  <option value="">Choose a country</option>
                  {countries.map((e) => (
                    <option key={e.id} value={e.name}>
                      {e.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="my-6 space-y-3">
                <label className="custom-checkbox flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="replyAllowed"
                    checked={addChronicle.replyAllowed}
                    onChange={handleChange}
                    className="w-5 h-5"
                  />
                  <span className="text-lg">Allow Replies</span>
                </label>
                <label className="custom-checkbox flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="emailAllowed"
                    checked={addChronicle.emailAllowed}
                    onChange={handleChange}
                    className="w-5 h-5"
                  />
                  <span className="text-lg">Allow Emails</span>
                </label>
                <label className="custom-checkbox flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="comments"
                    checked={addChronicle.comments}
                    onChange={handleChange}
                    className="w-5 h-5"
                  />
                  <span className="text-lg">Allow Comments</span>
                </label>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full tbh_button rounded-lg py-3 font-semibold transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></span>
                    Updating Chronicles...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Save Changes
                  </span>
                )}
              </button>
              <ErrorMessage message={error} />
            </form>
          </div>
        </section>
      ) : (
        // Responsive FlipBook (centered for desktop, full width mobile)
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            background: "#000004",
          }}
        >
          <div
            style={{
              width: dimensions.width,
              maxWidth: "1100px",
              margin: "0 auto",
              transition: "width 0.2s",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "100vh",
              background: "#000004",
            }}
          >
            <HTMLFlipBook
              ref={bookRef}
              width={dimensions.width}
              height={dimensions.height}
              minWidth={320}
              maxWidth={1100}
              minHeight={460}
              maxHeight={1200}
              size="fixed"
              showCover={false}
              drawShadow={true}
              flippingTime={1000}
              maxShadowOpacity={0.18}
              className="flipbook mx-auto rounded-xl shadow-2xl"
              style={{ width: "100%" }}
              startPage={0}
              usePortrait={isPortrait}
              startZIndex={0}
              autoSize={true}
              clickEventForward={true}
              useMouseEvents={true}
              swipeDistance={30}
              showPageCorners={true}
              disableFlipByClick={false}
              mobileScrollSupport={true}
            >
              {/* Cover */}
              <div
                onClick={(e) => e.stopPropagation()}
                onDoubleClick={handleCoverDoubleClick}
                style={{ cursor: "pointer" }}
                className="page-cover relative w-full h-full flex flex-col justify-center items-center text-white font-serif text-center overflow-hidden rounded-xl"
              >
                <Image
                  src={heroImg}
                  alt="Cover Background"
                  fill
                  priority
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-[#980000bb] mix-blend-multiply" />
                <div className="relative z-10 flex flex-col items-center justify-center h-full p-10">
                  <h1 className="text-4xl font-bold mb-4 leading-tight italic drop-shadow-lg">
                    {chronicle.yourStoryTitle}
                  </h1>
                  <p className="italic text-lg drop-shadow-md">
                    {chronicle.incidentFrom}
                  </p>
                  <p className="pt-10 text-sm opacity-90">
                    By: {chronicle.user?.firstname || "Unknown"}{" "}
                    {chronicle.user?.lastname || ""}
                  </p>
                </div>
              </div>
              {/* Story Pages */}
              {splitWords.map((text, i) => (
                <div
                  key={i}
                  className="page bg-[#fffbea] text-[#232323] font-serif leading-relaxed p-8 text-justify rounded-xl"
                  style={{
                    boxShadow:
                      "inset 16px 0 32px -22px #b1a991, 2px 0 8px 2px rgba(41,41,41,0.075)",
                  }}
                >
                  <p>{text}</p>
                </div>
              ))}
            </HTMLFlipBook>
          </div>
        </div>
      )}
      {openModal &&
        createPortal(
          <div className="openModal">
            <h3 className="font_two mb-1">Confirm Logout</h3>
            <p className="modal_message">Are you sure you want to log out?</p>
            <div className="pt-10 flex justify-end gap-4">
              <button onClick={DeleteAccFn} className="tbh_button logout_btn">
                Delete
              </button>
              <button
                onClick={() => setOpenModal(false)}
                className="bg-sky cancel_btn border px-3"
              >
                Cancel
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default Diary;

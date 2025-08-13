'use client'

import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function CreateChronicleForm() {  
  const router = useRouter();

  const [formData, setFormData] = useState({
    yourStoryTitle: "",
    chroniclesOfYou: "",
    incidentFrom: "",
    replyAllowed: false,
    comments: false,
    emailAllowed: false,
  });

  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = Cookies.get("token");

    if (!token) {
      setResponseMsg("You must be logged in.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/addChronicles", formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setResponseMsg(res.data.message || "Chronicle created!");
      setFormData({
        yourStoryTitle: "",
        chroniclesOfYou: "",
        incidentFrom: "",
        replyAllowed: false,
        comments: false,
        emailAllowed: false,
      });
      router.push("/"); // redirect home on error

    } catch (error: unknown) {
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const err = error as { response?: { data?: { message?: string } } };
        setResponseMsg(err.response?.data?.message || "Something went wrong");
      } else {
        setResponseMsg("Unexpected error");
      }
    }
  };

  return (
<form
  onSubmit={handleSubmit}
  className="max-w-lg mx-auto mt-12 p-8 rounded-2xl  border border-gray-700 shadow-xl space-y-6"
>
  <h2 className="text-3xl font-extrabold text-white text-center tracking-tight drop-shadow-md mb-4">
    Create Your Chronicle
  </h2>

  <input
    type="text"
    name="yourStoryTitle"
    placeholder="Title"
    value={formData.yourStoryTitle}
    onChange={handleChange}
    required
    className="w-full px-4 py-3 rounded-lg bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 hover:bg-gray-700/50 transition-all duration-300"
  />

  <textarea
    name="chroniclesOfYou"
    placeholder="Share your story..."
    value={formData.chroniclesOfYou}
    onChange={handleChange}
    required
    rows={5}
    className="w-full px-4 py-3 rounded-lg bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 hover:bg-gray-700/50 transition-all duration-300 resize-none"
  />

  <input
    type="text"
    name="incidentFrom"
    placeholder="Location (e.g., India)"
    value={formData.incidentFrom}
    onChange={handleChange}
    required
    className="w-full px-4 py-3 rounded-lg bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 hover:bg-gray-700/50 transition-all duration-300"
  />

  <div className="flex flex-wrap gap-6 justify-center">
    <label className="flex items-center gap-3 text-gray-200 cursor-pointer">
      <input
        type="checkbox"
        name="replyAllowed"
        checked={formData.replyAllowed}
        onChange={handleChange}
        className="w-5 h-5 accent-purple-500 rounded focus:ring-2 focus:ring-purple-400 transition"
      />
      <span className="text-sm font-medium">Allow Replies</span>
    </label>
    <label className="flex items-center gap-3 text-gray-200 cursor-pointer">
      <input
        type="checkbox"
        name="comments"
        checked={formData.comments}
        onChange={handleChange}
        className="w-5 h-5 accent-purple-500 rounded focus:ring-2 focus:ring-purple-400 transition"
      />
      <span className="text-sm font-medium">Enable Comments</span>
    </label>
    <label className="flex items-center gap-3 text-gray-200 cursor-pointer">
      <input
        type="checkbox"
        name="emailAllowed"
        checked={formData.emailAllowed}
        onChange={handleChange}
        className="w-5 h-5 accent-purple-500 rounded focus:ring-2 focus:ring-purple-400 transition"
      />
      <span className="text-sm font-medium">Allow Email</span>
    </label>
  </div>

  <button
    type="submit"
    disabled={loading}
    className="w-full tbh_button rounded-md"
  >
    {loading ? "Submitting..." : "Submit Chronicle"}
  </button>

  {responseMsg && (
    <p className="text-gray-200 text-center text-sm mt-4">{responseMsg}</p>
  )}
</form>

  );
}

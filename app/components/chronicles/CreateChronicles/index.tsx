'use client'

import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export default function CreateChronicleForm() {
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
    <form onSubmit={handleSubmit} className="max-w-lg mx-1 mt-10 rounded-3xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl space-y-6" >
      <h2 className="text-2xl font-bold text-white text-center drop-shadow mb-2">Create Chronicle</h2>

      <input
        type="text"
        name="yourStoryTitle"
        placeholder="Title"
        value={formData.yourStoryTitle}
        onChange={handleChange}
        required
        className="w-full px-4 py-3  "
      />

      <textarea
        name="chroniclesOfYou"
        placeholder="Your story..."
        value={formData.chroniclesOfYou}
        onChange={handleChange}
        required
        rows={5}
        className="w-full px-4 py-3 rounded-lg bg-white/70 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300 transition resize-none"
      />

      <input
        type="text"
        name="incidentFrom"
        placeholder="Location (e.g., India)"
        value={formData.incidentFrom}
        onChange={handleChange}
        required
        className="w-full px-4 py-3 rounded-lg bg-white/70 text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
      />

      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-white/90">
          <input
            type="checkbox"
            name="replyAllowed"
            checked={formData.replyAllowed}
            onChange={handleChange}
            className="accent-pink-400"
          />
          Allow Replies
        </label>
        <label className="flex items-center gap-2 text-white/90">
          <input
            type="checkbox"
            name="comments"
            checked={formData.comments}
            onChange={handleChange}
            className="accent-pink-400"
          />
          Enable Comments
        </label>
        <label className="flex items-center gap-2 text-white/90">
          <input
            type="checkbox"
            name="emailAllowed"
            checked={formData.emailAllowed}
            onChange={handleChange}
            className="accent-pink-400"
          />
          Allow Email
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-lg bg-gradient-to-r from-pink-400 to-violet-400 text-white font-semibold shadow hover:from-pink-500 hover:to-violet-500 transition"
      >
        {loading ? "Submitting..." : "Submit Chronicle"}
      </button>

      {responseMsg && (
        <p className="text-white/90 text-center mt-2">{responseMsg}</p>
      )}
    </form>

  );
}

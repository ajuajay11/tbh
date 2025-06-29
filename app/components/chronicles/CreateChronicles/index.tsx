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
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 rounded shadow space-y-4">
      <h2 className="text-xl font-semibold text-black">Create Chronicle</h2>

      <input
        type="text"
        name="yourStoryTitle"
        placeholder="Title"
        value={formData.yourStoryTitle}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />

      <textarea
        name="chroniclesOfYou"
        placeholder="Your story..."
        value={formData.chroniclesOfYou}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />

      <input
        type="text"
        name="incidentFrom"
        placeholder="Location (e.g., India)"
        value={formData.incidentFrom}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded"
      />

      <div className="flex gap-4">
        <label className="text-black">
          <input
            type="checkbox"
            name="replyAllowed"
            checked={formData.replyAllowed}
            onChange={handleChange}
          /> Allow Replies
        </label>
        <label className="text-black">
          <input
            type="checkbox"
            name="comments"
            checked={formData.comments}
            onChange={handleChange}
          /> Enable Comments
        </label>
        <label className="text-black">
          <input
            type="checkbox"
            name="emailAllowed"
            checked={formData.emailAllowed}
            onChange={handleChange}
          /> Allow Email
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Submitting..." : "Submit Chronicle"}
      </button>

      {responseMsg && <p className="text-black mt-2">{responseMsg}</p>}
    </form>
  );
}

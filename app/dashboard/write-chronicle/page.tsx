"use client";

import ImageCom from "@/app/components/ImageCom";
import { useState, ChangeEvent } from "react";
import Styles from "../dashboard.module.css";

// ✅ Define type for state
interface ChronicleData {
  yourStoryTitle: string;
  chroniclesOfYou: string;
  replyAllowed: boolean;
  emailAllowed: boolean;
  comments: boolean;
  incidentFrom: string;
  category: string;
}

function Page() {
  const [addChronicle, setAddChronicle] = useState<ChronicleData>({
    yourStoryTitle: "",
    chroniclesOfYou: "",
    replyAllowed: true,
    emailAllowed: true,
    comments: true,
    incidentFrom: "",
    category: "",
  });

  // ✅ Handles both text/select and checkbox inputs
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setAddChronicle((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  return (
    <div className={`${Styles.my_profile} ${Styles.glass_card} container   p-6 `}>
      {/* Title */}
      <div className="mb-4">
        <label htmlFor="yourStoryTitle" className="block mb-1  capitalize">
          Title
        </label>
        <input
          type="text"
          name="yourStoryTitle"
          value={addChronicle.yourStoryTitle}
          onChange={handleChange}
          placeholder="Enter your story title"
          className="w-full rounded-lg p-3 outline-none"
        />
      </div>

      {/* Category */}
      <div className="mb-4">
        <label htmlFor="yourStoryTitle" className="block mb-1 capitalize">
          chronicles Of You
        </label>
        <input
          type="text"
          name="chroniclesOfYou"
          value={addChronicle.chroniclesOfYou}
          onChange={handleChange}
          placeholder="Enter your story title"
          className="w-full rounded-lg p-3 outline-none"
        />
      </div>

      {/* ✅ Checkboxes Section */}
      <div className="mb-4  ">
        <label className="  mb-1">Permissions</label>

        <label className="  items-center gap-2">
          <input
            type="checkbox"
            name="replyAllowed"
            checked={addChronicle.replyAllowed}
            onChange={handleChange}
            className="w-4 h-4"
          />
          Allow Replies
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="emailAllowed"
            checked={addChronicle.emailAllowed}
            onChange={handleChange}
            className="w-4 h-4"
          />
          Allow Emails
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="comments"
            checked={addChronicle.comments}
            onChange={handleChange}
            className="w-4 h-4"
          />
          Allow Comments
        </label>
      </div>

      {/* Submit */}
      <button type="button" className="px-5 py-2 tbh_button">
        Submit
      </button>
    </div>
  );
}

export default ImageCom(Page);

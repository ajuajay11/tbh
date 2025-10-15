"use client";

import ImageCom from "@/app/components/ImageCom";
import { useState, ChangeEvent, FormEvent } from "react";
import Styles from "../dashboard.module.css";
import { countries } from "@/lib/Countries";
import Cookies from "js-cookie";
import axios from "axios";
import ErrorMessage from "@/app/components/ErrorMessage";
import { getBaseUrl } from "@/lib/getBaseUrl";
import SuccessMsg from "@/app/components/SuccessMsg";
// ✅ Define type for state
interface ChronicleData {
  yourStoryTitle: string;
  chroniclesOfYou: string;
  replyAllowed: boolean;
  emailAllowed: boolean;
  comments: boolean;
  incidentFrom: string;
}

function Page() {
  const [addChronicle, setAddChronicle] = useState<ChronicleData>({
    yourStoryTitle: "",
    chroniclesOfYou: "",
    replyAllowed: true,
    emailAllowed: true,
    comments: true,
    incidentFrom: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ Handles both text/select and checkbox inputs
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
  const submitChronicle = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const token = Cookies.get("token");

    try {
      const response = await axios.post(
        `${getBaseUrl()}/api/addChronicles`,
        addChronicle,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      if (response.status == 200) {
        const successMsg = response?.data?.message;

        setSuccess(successMsg);
      }

      // alert('Profile updated successfully!');
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
  return (
    <>
      <SuccessMsg successMsg={success} />
      <form onSubmit={submitChronicle} className={`${Styles.my_profile} ${Styles.glass_card} w-full h-full lg:h-auto`} >
        {/* Title */}
        <div className="my-5">
          <label htmlFor="yourStoryTitle" className="block mb-1  capitalize">
            {" "}
            Title{" "}
          </label>
          <input
            type="text"
            name="yourStoryTitle"
            value={addChronicle.yourStoryTitle}
            onChange={handleChange}
            placeholder="Enter your story title"
            className="w-full rounded-lg p-3 outline-none"
            required
          />
        </div>

        {/* Category */}
        <div className="mb-4">
          <label htmlFor="yourStoryTitle" className="block mb-1 capitalize">
            {" "}
            chronicles Of You{" "}
          </label>
          <textarea
            required
            name="chroniclesOfYou"
            value={addChronicle.chroniclesOfYou}
            onChange={handleChange} // pass the event directly
            placeholder="Enter your story title"
            className="w-full border border-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 placeholder-gray-500 resize-none"
            rows={7}
          />
        </div>
        <div>
          <label htmlFor="yourStoryTitle" className="block mb-1 capitalize">
            {" "}
            Incident From{" "}
          </label>
          <select
            name="incidentFrom"
            required
            id="incidentFrom"
            value={addChronicle.incidentFrom}
            onChange={handleChange} 
          >
            <option value="" className="bg-black">Choose Any</option>
            {countries.map((e) => (
              <option className="bg-black" key={e.id} value={e.name}>
                {" "}
                {e.name}{" "}
              </option>
            ))}
          </select>
        </div>
        {/* ✅ Checkboxes Section */}

        <div className="my-4 flex flex-col lg:flex-row gap-5 text-xl font_three">
          <label className="custom-checkbox">
            <input
              type="checkbox"
              name="replyAllowed"
              checked={addChronicle.replyAllowed}
              onChange={handleChange}
            />
            <span className="checkmark"></span>
            <span>Allow Replies</span>
          </label>

          <label className="custom-checkbox">
            <input
              type="checkbox"
              name="emailAllowed"
              checked={addChronicle.emailAllowed}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span className="checkmark"></span>
            Allow Emails
          </label>

          <label className="custom-checkbox">
            <input
              type="checkbox"
              name="comments"
              checked={addChronicle.comments}
              onChange={handleChange}
            />
            <span className="checkmark"></span>
            Allow Comments
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full tbh_button rounded-lg"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></span>
              Creating Chronicles...
            </span>
          ) : (
            <span className="flex items-center justify-center">Submit</span>
          )}
        </button>
        <ErrorMessage message={error} />
      </form>
    </>
  );
}

export default ImageCom(Page);

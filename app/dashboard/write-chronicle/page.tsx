"use client";

import ImageCom from "@/app/components/ImageCom";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import Styles from "../dashboard.module.css";
import { countries } from "@/lib/countries";
import Cookies from "js-cookie";
import axios from "axios";
import ErrorMessage from "@/app/components/ErrorMessage";
import { getBaseUrl } from "@/lib/getBaseUrl";
import SuccessMsg from "@/app/components/SuccessMsg";
import Link from "next/dist/client/link";
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
  const [title, setTitleCount] = useState<number>(0);
  const [description, setDescriptionCount] = useState<number>(0);

  useEffect(() => {
   setTitleCount(addChronicle.yourStoryTitle.length);
    setDescriptionCount(addChronicle.chroniclesOfYou.length);
  }, [addChronicle.yourStoryTitle, addChronicle.chroniclesOfYou]);
  
  // ✅ Handles both text/select and checkbox inputs
  const handleChange = ( e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> ) => {
    const { name, value, type } = e.target;
    const newValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
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
      const response = await axios.post( `${getBaseUrl()}/api/addChronicles`,
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
        window.location.href = "/dashboard";
        setSuccess(successMsg);
      }  
    } catch (err: unknown) {
      console.log(err);
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
      <div className={`overflow-y-scroll scrollbar-none  ${Styles.glass_card}`} style={{ height: "100 vh" }} >
        <form onSubmit={submitChronicle} className={`${Styles.my_profile}  w-full h-full lg:h-auto pb-20`} >
          {/* Title */}
          <div className="my-3">
            <label htmlFor="yourStoryTitle" className="block mb-1 capitalize">
              {" "}
              Title{" "}
            </label>
            <input type="text" name="yourStoryTitle" value={addChronicle.yourStoryTitle} onChange={handleChange} placeholder="Enter your story title"
              className="w-full rounded-lg p-3 outline-none" minLength={20} maxLength={150}
              required
            />
            <div className="flex justify-between mt-1" style={{fontSize:"10px"}}>
              <p className={`${title >= 20 ? "text-green-500" : "text-red-500"}`}>{title} / 150</p> (Minimum 20 characters)
            </div>
          </div>

          {/* Category */}
          <div className="mb-4">
            <label htmlFor="yourStoryTitle" className="block mb-1 capitalize">
              {" "}
              chronicles Of You{" "}
            </label>
            <textarea required name="chroniclesOfYou"
              value={addChronicle.chroniclesOfYou}
              onChange={handleChange} // pass the event directly
              placeholder="Enter your story title"
              className="w-full border border-gray-700 outline-none transition-all duration-200 placeholder-gray-500 resize-none px-3 py-5" minLength={200} maxLength={1000}
              rows={7}
            />
            <div className="flex justify-between mb-1" style={{fontSize:"10px"}}>

            <p className={`${description >= 200 ? "text-green-500" : "text-red-500"}`} >{description} / 1000</p> (Minimum 200 characters)
            </div>
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
              <option value="" className="bg-black">
                Choose Any
              </option>
              {countries.map((e) => (
                <option className="bg-black" key={e.id} value={e.name}>
                  {" "}
                  {e.name}{" "}
                </option>
              ))}
            </select>
          </div>
          {/* ✅ Checkboxes Section */}

          <div className="my-4 flex flex-col lg:flex-row lg:gap-5 text-xl font_three">
            {/* <label className="custom-checkbox">
              <input
                type="checkbox"
                name="replyAllowed"
                checked={addChronicle.replyAllowed}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              <span>Allow Replies</span>
            </label> */}

            {/* <label className="custom-checkbox">
              <input
                type="checkbox"
                name="emailAllowed"
                checked={addChronicle.emailAllowed}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span className="checkmark"></span>
              Allow Emails
            </label> */}

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

          <label className="custom-checkbox">
            <input
              type="checkbox"
              name="terms"
              className="cursor-pointer"
              id="terms" required
            />
            <span className="checkmark"></span>
               I agree to the{" "}
              <Link
                href="/terms-and-condition"
                className="underline text-blue-400 hover:text-blue-300 transition-colors"
              >
                Terms & Conditions
              </Link>
           </label>
          <ErrorMessage message={error} />

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full tbh_button rounded-lg mb-30"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></span>
                Creating Chronicles...
              </span>
            ) : (
              <span className="flex items-center justify-center b-10">
                Submit
              </span>
            )}
          </button>
        </form>
      </div>
    </>
  );
}

export default ImageCom(Page);

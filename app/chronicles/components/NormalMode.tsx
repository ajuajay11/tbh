"use client";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Chronicle } from "@/app/types/chronicle";
import { createPortal } from "react-dom";
import { getBaseUrl } from "@/lib/getBaseUrl";
import ErrorMessage from "@/app/components/ErrorMessage";
import SuccessMsg from "@/app/components/SuccessMsg";
import axios from "axios";
import Cookies from "js-cookie";
import Styles from "../../dashboard/dashboard.module.css";
import { countries } from "@/lib/countries";
import Likes from "./Likes";
import ShareComp from "./ShareComp";
import Comments from "./Comments";
interface ChronicleFormData {
  yourStoryTitle: string;
  chroniclesOfYou: string;
  incidentFrom: string;
  emailAllowed: boolean;
  comments: boolean;
  replyAllowed: boolean;
}

interface ChronicleCardProps {
  chronicle: Chronicle;
}

export default function ChronicleCard({ chronicle }: ChronicleCardProps) {
  const [openModal, setOpenModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
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

  useEffect(() => {
    const userId = Cookies.get("userId");
    setIsOwner(userId === chronicle.user?._id);
  }, [chronicle.user?._id]);

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
  return (
    <>
      <SuccessMsg successMsg={success} />

     <div className="h-screen">
       {isEditable ? (
        <section className="min-h-screen flex items-center justify-center p-4">

          <div className="w-full max-w-2xl">
            <SuccessMsg successMsg={success} />

            <form
              onSubmit={submitChronicle}
              className={`${Styles.my_profile} ${Styles.glass_card} w-full lg:p-6`}
            >
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
        <div className="py-5 lg:h-screen ">
         <div className="bg-[#111] text-white h-full rounded-2xl shadow-lg p-6 max-w-3xl mx-auto border border-[#222] transition-all hover:border-[#444]">
          {/* Header */}
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
          <div className="flex flex-col lg:flex-row gap-2 justify-between items-center mb-3">

            <div>

              <h2 className="font_twp font-semibold text-[#fafafa]">
                {chronicle.yourStoryTitle}
              </h2>
              <p className="text-sm text-gray-400">
                by{" "}
                <span className="font-medium">
                  {chronicle.user
                    ? chronicle.user.username
                    : "Anonymous Stranger"}
                </span>{" "}
                •{" "}
                {new Date(chronicle.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
            <span className="text-xs bg-[#222] px-3 py-1 rounded-full text-gray-400">
              {chronicle.incidentFrom}
            </span>
          </div>

          {/* Story Content */}
          <p className="text-gray-300 leading-relaxed whitespace-pre-line mb-5">
            {chronicle.chroniclesOfYou}
          </p>

          {/* Actions */}

          <div className="flex gap-2 items-center">
            <Likes
              Pid={chronicle._id || ""}
              userLikesData={chronicle.UserLikes || []}
            />
           {chronicle?.comments ?
             <Comments
              Pid={chronicle._id || ""}
              userCommentsData={chronicle.UserComments || []}
            />:null
           }

            <ShareComp Pid={chronicle._id || ""} Title={chronicle.yourStoryTitle || ""} />
          </div>

        </div >
        </div>
      )
      }
     </div>
      {
        openModal &&
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
        )
      }
    </>
  );
}

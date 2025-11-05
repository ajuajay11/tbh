"use client";
import ImageCom from "../../components/ImageCom";
import axios from "axios";
import Image from "next/image";
import Cookies from "js-cookie";
import ErrorMessage from "@/app/components/ErrorMessage";
import SuccessMsg from "@/app/components/SuccessMsg";
import { ImagePlay } from "lucide-react";
import { getBaseUrl } from "@/lib/getBaseUrl";

import Styles from "../dashboard.module.css";
// import { useRouter } from "next/navigation"; // ✅ Correct client-side hook
import { useState, useEffect, ChangeEvent, FormEvent, useRef } from "react";
interface User {
  email: string;
  firstname: string;
  lastname: string;
  gender: string;
  age: number;
  username: string;
  profilePicture?: string; // <- ADD THIS LINE
}
interface UserResponse {
  getUser: User;
}

function Page() {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const divRef = useRef<HTMLDivElement | null>(null);
  // const [scrollY, setScrollY] = useState(0);
//   const handleScroll = () => {
//     if (divRef.current) {
//       const currentScroll = divRef.current.scrollTop; // ✅ current scroll position
//       setScrollY(currentScroll);
//        // ✅ Hide all elements with class "mock" if scroll >= 100
//     const mocks = document.getElementsByClassName("mock");
// console.log(scrollY);

//     for (let i = 0; i < mocks.length; i++) {
//       const el = mocks[i] as HTMLElement;
//       if (currentScroll >= 100) {
//         el.style.display = "none";
//       } else {
//         el.style.display = "block";
//       }
//     }
//     }
//   };
  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch(`${getBaseUrl()}/api/user`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      const data = await res.json();
      console.log(data.getUser);

      setUser(data);
    };
    fetchUser();
  }, []);

  const [updateProfile, setUpdateProfile] = useState({
    email: "",
    firstname: "",
    lastname: "",
    gender: "",
    age: 0,
    username: "",
    profilePicture: null as File | null,
  });

  useEffect(() => {
    const userData = user?.getUser;
    if (userData) {
      setUpdateProfile((prev) => ({
        ...prev,
        email: userData.email || "",
        firstname: userData.firstname || "",
        lastname: userData.lastname || "",
        gender: userData.gender || "",
        age: userData.age || 0,
        username: userData.username || "",
        profilePicture: null, // keep this null unless user uploads a new file
      }));

      if (userData.profilePicture) {
        setPreviewUrl(userData.profilePicture); // string URL
      }
    }
  }, [user]);

  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUpdateProfile((prev) => ({
      ...prev,
      [name]: name === "age" ? Number(value) : value,
    }));
  };

  // Separate handler for file input
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      setUpdateProfile((prev) => ({
        ...prev,
        profilePicture: file,
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const token = Cookies.get("token");
    const formData = new FormData();

    // Append all form data
    Object.entries(updateProfile).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (key === "profilePicture" && value instanceof File) {
          formData.append(key, value);
        } else if (key !== "profilePicture") {
          formData.append(key, value.toString());
        }
      }
    });

    try {
      // IMPORTANT: Send FormData directly, not wrapped in an object
      // Also remove Content-Type header - browser will set it automatically with boundary
      const response = await axios.post("/api/user/updateProfile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type - let browser handle it for FormData
        },
      });
      console.log(response);
      if (response.status == 200) {
        const successMsg = response?.data?.message;
        Cookies.set("avatar", response?.data?.user?.profilePicture, {
          expires: 12,
        });
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
      <div className="w-full max-w-2xl pt-20 lg:pt-1 overflow-y-scroll scrollbar-none " style={{height:"95vh"}} ref={divRef}
         >
        <div  >
          {/* Header Section */}

          {/* Form Section */}
          <form onSubmit={submitProfile} className="p-8 space-y-8 ">
            {/* Profile Picture Section */}
            <div className={`text-center`}>
              <div className="relative inline-block">
                {previewUrl ? (
                  <div className="relative">
                    <Image
                      src={previewUrl}
                      alt="Profile preview"
                      width={90}
                      height={90}
                      className="w-30 h-30 rounded-full object-cover border-4 border-white shadow-lg mx-auto"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-200">
                      <ImagePlay />
                    </div>
                  </div>
                ) : (
                  <div className="w-30 h-30 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center border-4 border-white shadow-lg mx-auto">
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <label className="block mt-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="sr-only"
                />
                <span className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-red-500 text-white font-medium rounded-full cursor-pointer hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                  <ImagePlay />
                  Choose Photo
                </span>
              </label>
              <p className="text-gray-500 mt-2">PNG, JPG up to 5MB</p>
            </div>

            {/* Form Fields Grid */}
            <div
              className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${Styles.my_profile}`}
            >
              {/* Email Field */}
              <div className="md:col-span-2">
                <label htmlFor="email"> Email Address  </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={updateProfile.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                  />
                   
                </div>
              </div>

              {/* First Name */}
              <div>
                <label htmlFor="firstname"> First Name </label>
                <input
                  type="text"
                  name="firstname"
                  value={updateProfile.firstname}
                  onChange={handleChange}
                  placeholder="First name"
                  required
                />
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lastname"> Last Name </label>
                <input
                  type="text"
                  name="lastname"
                  value={updateProfile.lastname}
                  onChange={handleChange}
                  placeholder="Last name"
                  required
                />
              </div>

              {/* Gender */}
              <div>
                <label htmlFor="gender">Gender</label>
                <select
                  className="w-full px-4 py-4 border-2 transition-all duration-200  appearance-none "
                  name="gender"
                  value={updateProfile.gender}
                  onChange={handleChange}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Age */}
              <div>
                <label
                  htmlFor="age"
                   
                >
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={updateProfile.age || ""}
                  onChange={handleChange}
                  placeholder="Your age"
                  min="1"
                  max="120"
                />
              </div>

              {/* Username */}
              <div className="md:col-span-2">
                <label htmlFor="username">Username</label>
                <div className="relative">
                  <input
                    type="text"
                    name="username"
                    value={updateProfile.username}
                    onChange={handleChange}
                    placeholder="Choose a unique username"
                  />
                   
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full tbh_button rounded-lg"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Updating Profile...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    Update Profile
                  </div>
                )}
              </button>
            </div>
          </form>
          <ErrorMessage message={error} />
        </div>
      </div>
    </>
  );
}
export default ImageCom(Page);

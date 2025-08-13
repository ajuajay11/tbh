'use client'
import axios from "axios"
import Image from "next/image";
import Cookies from "js-cookie";
import ErrorMessage from "@/app/components/ErrorMessage";
import SuccessMsg from "@/app/components/SuccessMsg";
// import { useRouter } from "next/navigation"; // ✅ Correct client-side hook
import { useState, useEffect, ChangeEvent, FormEvent } from "react";
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

export default function Page() {
    const [user, setUser] = useState<UserResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    useEffect(() => {
        const fetchUser = async () => {

            const res = await fetch("/api/user", {
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
            setUpdateProfile(prev => ({
                ...prev,
                email: userData.email || "",
                firstname: userData.firstname || "",
                lastname: userData.lastname || "",
                gender: userData.gender || "",
                age: userData.age || 0,
                username: userData.username || "",
                profilePicture: null  // keep this null unless user uploads a new file
            }));

            if (userData.profilePicture) {
                setPreviewUrl(userData.profilePicture); // string URL
            }
        }
    }, [user]);

    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUpdateProfile(prev => ({
            ...prev,
            [name]: name === 'age' ? Number(value) : value
        }));
    };

    // Separate handler for file input
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Check file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size should be less than 5MB');
                return;
            }

            // Check file type
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }

            setUpdateProfile(prev => ({
                ...prev,
                profilePicture: file
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
                if (key === 'profilePicture' && value instanceof File) {
                    formData.append(key, value);
                } else if (key !== 'profilePicture') {
                    formData.append(key, value.toString());
                }
            }
        });

        try {
            // IMPORTANT: Send FormData directly, not wrapped in an object
            // Also remove Content-Type header - browser will set it automatically with boundary
            const response = await axios.post("/api/user/updateProfile", formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    // Don't set Content-Type - let browser handle it for FormData
                },
            })
            console.log(response);
            const successMsg = response?.data?.message;
            setSuccess(successMsg)
            // alert('Profile updated successfully!');
        } catch (err: unknown) {
      let message = 'Unexpected error';
 
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || err.message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
    } finally {
            setLoading(false);
        }
    }

    return (
        <><SuccessMsg successMsg={success} />
        <div className="w-full max-w-2xl pt-20 lg:pt-1">
          <div className="  overflow-hidden">
            {/* Header Section */}
            

            {/* Form Section */}
            <form onSubmit={submitProfile} className="p-8 space-y-8">
              
              {/* Profile Picture Section */}
              <div className="text-center">
                <div className="relative inline-block">
                  {previewUrl ? (
                    <div className="relative">
                      <Image 
                        src={previewUrl} 
                        alt="Profile preview" 
                        width={120} 
                        height={120} 
                        className="w-30 h-30 rounded-full object-cover border-4 border-white shadow-lg mx-auto" 
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-200">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <div className="w-30 h-30 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center border-4 border-white shadow-lg mx-auto">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
                <label className="block mt-4">
                  <input type="file" accept="image/*" onChange={handleFileChange} className="sr-only" 
                  />
                  <span className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-red-500 text-white font-medium rounded-full cursor-pointer hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Choose Photo
                  </span>
                </label>
                <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 5MB</p>
              </div>

              {/* Form Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Email Field */}
                <div className="md:col-span-2">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2"> Email Address </label>
                  <div className="relative">
                    <input type="email" name="email" value={updateProfile.email} onChange={handleChange} className="w-full px-10 py-4 border-2 bg-transparent rounded-2xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-200 text-gray-700 placeholder-gray-400" placeholder="your@email.com" required />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* First Name */}
                <div>
                  <label htmlFor="firstname" className="block text-sm font-semibold text-gray-700 mb-2"> First Name </label>
                  <input type="text" name="firstname" value={updateProfile.firstname} onChange={handleChange} className="w-full px-4 py-4 border-2 bg-transparent rounded-2xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-200 text-gray-700 placeholder-gray-400" placeholder="First name" required  />
                </div>

                {/* Last Name */}
                <div>
                  <label htmlFor="lastname" className="block text-sm font-semibold text-gray-700 mb-2"> Last Name </label>
                  <input type="text" name="lastname" value={updateProfile.lastname} onChange={handleChange} 
                    className="w-full px-4 py-4 border-2 bg-transparent rounded-2xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-200 text-gray-700 placeholder-gray-400" 
                    placeholder="Last name"
                    required 
                  />
                </div>

                {/* Gender */}
                <div>
                  <label htmlFor="gender" className="block text-sm font-semibold text-gray-700 mb-2">
                    Gender
                  </label>
                  <select 
                    name="gender" 
                    value={updateProfile.gender} 
                    onChange={handleChange}  
                    className="w-full px-4 py-4 border-2 bg-transparent rounded-2xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-200 text-gray-700 appearance-none cursor-pointer"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Age */}
                <div>
                  <label htmlFor="age" className="block text-sm font-semibold text-gray-700 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={updateProfile.age || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-4 border-2 bg-transparent rounded-2xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-200 text-gray-700 placeholder-gray-400"
                    placeholder="Your age"
                    min="1"
                    max="120"
                  />
                </div>

                {/* Username */}
                <div className="md:col-span-2">
                  <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="username"
                      value={updateProfile.username}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-4 border-2 bg-transparent rounded-2xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-200 text-gray-700 placeholder-gray-400"
                      placeholder="Choose a unique username"
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-red-500 to-red-500 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/50"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      Updating Profile...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
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
    )
}
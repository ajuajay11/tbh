'use client'
import axios from "axios"
import Image from "next/image";
import Cookies from "js-cookie";
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
            alert('Profile updated successfully!');
        } catch (error) {
            console.error(error);
            alert('Error updating profile');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <form onSubmit={submitProfile} className=" p-6  shadow-lg space-y-5" >
                <h2 className="text-2xl font-bold text-center text-gray-800">Update Profile</h2>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2"> Profile Picture </label>
                    {previewUrl && (
                        <div className="mb-3 flex justify-center">
                            <Image src={previewUrl} alt="Profile preview" width={100} height={100} className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"  />
                        </div>
                    )}
                    <input type="file" accept="image/*" onChange={handleFileChange} className="mt-1 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                    <p className="text-xs text-gray-500 mt-1">Max size: 5MB</p>
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email </label>
                    <input type="email" name="email" value={updateProfile.email} onChange={handleChange} className="mt-1 w-full p-2 " required />
                </div>

                <div>
                    <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">First Name </label>
                    <input type="text" name="firstname" value={updateProfile.firstname} onChange={handleChange} className="mt-1 w-full p-2 " required />
                </div>

                <div>
                    <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">Last Name </label>
                    <input type="text" name="lastname" value={updateProfile.lastname} onChange={handleChange} className="mt-1 w-full p-2 " required />
                </div>

                <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700"> Gender </label>
                    <select name="gender" value={updateProfile.gender} onChange={handleChange}  className="mt-1 w-full p-2 "
                    >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
                    <input
                        type="number"
                        name="age"
                        value={updateProfile.age || ""}
                        onChange={handleChange}
                        className="mt-1 w-full p-2 "
                        min="1"
                        max="120"
                    />
                </div>

                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={updateProfile.username}
                        onChange={handleChange}
                        className="mt-1 w-full p-2 "
                    />
                </div>

                <div className="text-center">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text white font-semibold py-2 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Updating...' : 'Submit'}
                    </button>
                </div>
            </form>
        </div>
    )
}
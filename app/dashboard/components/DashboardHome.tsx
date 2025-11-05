"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ImageCom from "../../components/ImageCom";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "../components/useContext";
import UserProfileScroll from "@/app/components/UserProfileScroll";

function DashboardHome() {
  const { chronicles, userData } = useUser();
  const [isMounted, setIsMounted] = useState(false);
  const [profileSrc, setProfileSrc] = useState("/butterfly1.png");
  const searchParams = useSearchParams();
 useEffect(() => {
    setIsMounted(true);
     
    const profile = userData?.profilePicture;
 
    if (profile) {
      try {
        // Ensure the avatar is a valid URL or file path
        new URL(profile);
        setProfileSrc(profile);
      } catch {
        // If not a full URL, treat as a local file (e.g., /uploads/profile.png)
        if (profile.startsWith("/")) {
          setProfileSrc(profile);
        } else {
          setProfileSrc("/butterfly1.png");
        }
      }
    }
  }, [userData?.profilePicture]);

  if (!isMounted) return null;

  const user = searchParams.get("user");
  const userName = Cookies.get("username");

  return (
    <section className="max-w-4xl mx-auto">
          <div className="px-4 pb-6">
            <div className="flex items-center gap-5 lg:gap-10">
              <div className="flex-shrink-0">
                <Image width={90}
                  height={90}
                  alt="profile"
                  className="rounded-full border mt-10"
                  src={profileSrc}
                />
              </div>
    
              <div className="flex-1">
                <div className="flex items-center gap-6 lg:gap-40 justify-between">
                  <h1 className="font_three ">
                    {userData?.username || "to Be Honest"}
                  </h1>
                  {user === userName && (
                    <Link
                      href="/dashboard/my-profile"
                      className="px-3 py-1.5 tbh_button text-white rounded-lg text-sm font-semibold "
                    >
                      edit
                    </Link>
                  )}
                </div>
    
                <div className="flex gap-8 mb-2">
                  <div className="text-center">
                    <span className="font-semibold">{chronicles?.length || 0}</span>
                    <span className="text-gray-600 ml-1">posts</span>
                  </div>
                </div>
    
                <div className="text-sm">
                  {/* <p className="font-semibold capitalize">
                    {userData?.firstname} {userData?.lastname}
                  </p> */}
                  <p className="text-gray-600 ">{userData?.email}</p>
                </div>
              </div>
            </div>
          </div>
    
          <div className="scrollbar-none authorandDashboardScroll mb-5">
                       <UserProfileScroll chronicles={chronicles} />
           
          </div>
        </section>
  );
}

export default ImageCom(DashboardHome);

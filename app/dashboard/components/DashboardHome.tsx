"use client";
import { useEffect, useState } from "react";
import ImageCom from "../../components/ImageCom";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "../components/useContext";

function DashboardHome() {
  const { chronicles, userData } = useUser();
  const [isMounted, setIsMounted] = useState(false);
  const [profileSrc, setProfileSrc] = useState("/butterfly1.png");

  useEffect(() => {
    setIsMounted(true);
    const profile = Cookies.get("avatar");
    if (profile) {
      try {
        new URL(profile);
        setProfileSrc(profile);
      } catch {
        setProfileSrc("/butterfly1.png");
      }
    }
  }, []);

  if (!isMounted) {
    // Avoid SSR/CSR mismatch by rendering nothing until hydrated
    return null;
  }

  return (
    <section className="max-w-4xl mx-auto">
      <div className="px-4 py-6">
        <div className="flex items-center gap-5 lg:gap-10 mb-6">
          <div className="flex-shrink-0">
            <Image
              width={90}
              height={90}
              alt="profile"
              className="rounded-full border"
              src={profileSrc}
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-6 lg:gap-40 justify-between">
              <h1 className="text-xl font-light">
                {userData?.username || "to Be Honest"}
              </h1>
              <Link href="/dashboard/my-profile" className="px-3 py-1.5 tbh_button text-white rounded-lg text-sm font-semibold hover:bg-blue-600"
              >
                edit
              </Link>
            </div>

            <div className="flex gap-8 mb-2">
              <div className="text-center">
                <span className="font-semibold">{chronicles?.length || 0}</span>
                <span className="text-gray-600 ml-1">posts</span>
              </div>
              <div className="text-center">
                <span className="font-semibold">272</span>
                <span className="text-gray-600 ml-1">following</span>
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

      <div>
        {chronicles && chronicles.length > 0 ? (
          <div className="grid grid-cols-3 gap-1" >
            {chronicles.map((item) => (
              <Link
                  href={`/chronicles/${item._id}`}
                key={item._id}
                className="aspect-square relative group cursor-pointer overflow-hidden"
              >
                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black-900 flex items-center justify-center p-4">
                  <p className="capitalize text-center">
                    {item.yourStoryTitle}
                  </p>
                </div>

                 
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="text-gray-400 text-sm">No posts yet</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default ImageCom(DashboardHome);

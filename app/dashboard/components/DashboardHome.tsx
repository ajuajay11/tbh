"use client";
import ImageCom from "../../components/ImageCom";
 import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "../components/useContext";

 
 function DashboardHome( ) {
    const { chronicles, userData } = useUser();

  const profile = Cookies.get("avatar");
  const isValidUrl = (url: string | undefined) => {
    if (!url) return false; // ✅ Handle undefined/null
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };
   const profileSrc = isValidUrl(profile) ? profile! : "/butterfly1.png";
  return (
    <>
      <section className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="px-4 py-6">
          <div className="flex items-center gap-5 lg:gap-10 mb-6">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <Image width={90} height={90} sizes="(max-width: 1024px) 80px, 100px" alt="profile" className="rounded-full border" src={profileSrc} />
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center gap-6 lg:gap-40 ">
                <h1 className="text-xl font-light">
                  {userData?.username || "to Be Honest"}
                </h1>
                <Link href="/dashboard/my-profile" className="px-3 py-1.5 tbh_button text-white rounded-lg text-sm font-semibold hover:bg-blue-600"> edit </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mb-4">
                <div className="text-center">
                  <span className="font-semibold"> {chronicles?.length || 0} </span>
                  <span className="text-gray-600 ml-1">posts</span>
                </div>
                 
                <div className="text-center">
                  <span className="font-semibold">272</span>
                  <span className="text-gray-600 ml-1">following</span>
                </div>
              </div>

              {/* Bio */}
              <div className="text-sm">
                <p className="font-semibold capitalize"> {userData?.firstname} {userData?.lastname} </p>
                <p className="text-gray-600">{userData?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div>
          {chronicles && chronicles.length > 0 ? (
            <div className="grid grid-cols-3 gap-1">
              {chronicles.map((item) => (
                <div
                  key={item._id}
                  className="aspect-square bg-gray-100 relative group cursor-pointer overflow-hidden"
                >
                  {/* If you have images, show them. Otherwise show preview */}
                  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center p-4">
                    <p className="text-white text-xs line-clamp-6 text-center">
                      {item.yourStoryTitle}
                    </p>
                  </div>

                  {/* Hover Overlay with Stats */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">❤️</span>
                      <span className="font-semibold">
                        {item.likeCount || 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">💬</span>
                      <span className="font-semibold">
                        {item.UserComments ? item.UserComments.length : 0}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="text-gray-400 text-sm">No posts yet</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default ImageCom(DashboardHome);

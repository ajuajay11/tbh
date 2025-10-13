"use client";
import { Link } from "lucide-react";
import ImageCom from "../../components/ImageCom";
import { Chronicle, User } from "../../types/chronicle";
import Cookies from "js-cookie";
import Image from "next/image";
interface DashboardHomeProps {
  myChronicles: Chronicle[];
  userDetails: User;
}
function DashboardHome({ myChronicles, userDetails }: DashboardHomeProps) {
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
  console.log(userDetails);
  const profileSrc = isValidUrl(profile) ? profile! : "/butterfly1.png";
  return (
    <>
      <section className="lg:me-60">
        <div className="profile-section flex justfy-evenly">
          <div>
            <Image
              src={profileSrc}
              width={100}
              height={100}
              className="object-cover"
              alt="User profile picture"
              sizes="10px"
            />
          </div>
          <div>
            <p>{userDetails?.firstname}</p>
            <p>{userDetails?.lastname}</p>
          </div>
        </div>
        {/* Chronicles Section - ✅ Fixed: use myChronicles directly */}
        {myChronicles?.length > 0 ? (
          <div className="grid gap-2">
            {myChronicles.map((item) => (
              <Link
                to="/"
                key={item._id}
                className=" "
              >
                hei
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 rounded-xl">
            <p className="text-gray-600">No chronicles found</p>
          </div>
        )}
      </section>
    </>
  );
}

export default ImageCom(DashboardHome);

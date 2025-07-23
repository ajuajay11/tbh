import Link from "next/link";
import Logout from "@/app/components/logout"

export default function CategoriesGrid() {
  const menuItems = [
    {
      id: 1,
      name: "My Profile",
      bgColor: "bg-gradient-to-br from-emerald-400 to-emerald-600",
      link: "/dashboard/my-profile"
    },
    {
      id: 2,
      name: "My Chronicles",
      bgColor: "bg-gradient-to-br from-red-400 to-red-600",
      link: "/dashboard/mychronicles"
    },
    {
      id: 3,
      name: "Settings",
      bgColor: "bg-gradient-to-br from-purple-600 to-purple-900",
      link: "/dashboard/settings"
    },
    {
      id: 4,
      name: "Inclusion",
      bgColor: "bg-gradient-to-br from-pink-400 to-pink-600",
      link: "/dashboard/inclusion"
    },
    {
      id: 5,
      name: "Logout",
      bgColor: "bg-gradient-to-br from-gray-700 to-gray-900",
      isLogout: true,
      link: ""

    }
  ];

 
  return (
    <div className="container mx-auto px-4 pt-20">
  <div className="flex flex-wrap mx-4">
    <div className="w-full px-4 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Categories</h1>
      <div className="grid grid-cols-2 gap-4">
        {menuItems.map((item) => (
          item.isLogout ? (
            <div
              key={item.id}
              className={`${item.bgColor} rounded-xl p-4 relative overflow-hidden transform transition-all duration-200 hover:scale-105 hover:shadow-lg`}
              style={{ minHeight: '120px' }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="flex-1"></div>
                <div>
                  <Logout />
                </div>
              </div>
              <div className="absolute top-2 right-2 w-8 h-8 bg-white bg-opacity-20 rounded-full"></div>
            </div>
          ) : (
            <Link
              key={item.id}
              href={item?.link}
              className={`${item.bgColor} rounded-xl p-4 relative overflow-hidden cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-lg block`}
              style={{ minHeight: '120px' }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="flex-1"></div>
                <div>
                  <h3 className="text-white font-semibold text-sm leading-tight">
                    {item.name}
                  </h3>
                </div>
              </div>
              <div className="absolute top-2 right-2 w-8 h-8 bg-white bg-opacity-20 rounded-full"></div>
            </Link>
          )
        ))}
      </div>
    </div>
  </div>
</div>

  );
};
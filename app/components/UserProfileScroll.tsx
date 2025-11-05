 "use client"
 import { truncatedDesc } from "@/utils/truncatedText";
    import Link from "next/link";
import {Chronicle} from "@/app/types/chronicle";


export default function UserProfileScroll({chronicles}: {chronicles: Chronicle[]}) {
  return (
     <>
      {chronicles && chronicles.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-1">
            {chronicles.map((item) => (
              <Link href={`/chronicles/${item._id}`} key={item._id}
                className="lg:aspect-square relative group cursor-pointer overflow-hidden p-1"
              >
                <div className="w-full flex-col rounded-xl lg:h-full bg-zinc-950 flex items-center lg:justify-center p-10 lg:p-5">
                  <h2 className="uppercase text-start lg:text-center font-bold">
                    {truncatedDesc(item.yourStoryTitle, 50)}
                  </h2>
                  <p className="capitalize text-start lg:text-center mt-4">
                    {truncatedDesc(item.chroniclesOfYou, 80)}
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
     </>
  )
}

 
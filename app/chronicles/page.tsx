import { ChronicleResponse, Chronicle  } from "../types/chronicle";
import "./chronicle.module.css";
import Comments from "./components/Comments";
import Likes from "./components/Likes";
 
export default async function Chronicles() {
  const res = await fetch("http://localhost:3000/api/getAllChronicles", {
    cache: "no-store", // ensures fresh data
  });
  const result: ChronicleResponse = await res.json();
  
  const chronicles: Chronicle[] = result.limitedChronicles;
  console.log(chronicles);
  return (
    <div className="p-2">
      <h1 className="text-2xl font-bold mb-4 text-center">Chronicles</h1>
      <div className="grid gap-2">
        {chronicles.map((item) => (
          <div
            key={item._id}
            className="p-4 rounded-xl shadow-md border bg-white"
          >
            {/* Story Title */}
            <h2 className="text-xl font-semibold">{item.yourStoryTitle}</h2>
            <p className="mt-2 text-gray-700 whitespace-pre-line">
              {item.chroniclesOfYou}
            </p>

            {/* Extra Info */}
            <div className="text-sm text-gray-500">
              <p>
                <strong>From:</strong> {item.incidentFrom}
              </p>
              <p>
                <strong>By:</strong>{" "}
                {item.user
                  ? `${item.user.firstname} ${item.user.lastname} (@${item.user.username})`
                  : "Anonymous"}
              </p>
              <p>
                <strong>Likes:</strong> {item.likeCount || 0}
              </p>
              <p>
                <strong>Comments:</strong>{" "}
                {item.UserComments ? item.UserComments.length : 0}
              </p>
            </div>
            {<Comments userCommentsData={item.UserComments || [] } />   }
            {<Likes userLikesData={item.UserLikes || [] } />   }
          </div>
        ))}
      </div>
    </div>
  );
}

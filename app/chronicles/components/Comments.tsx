import {UserComment} from "../../types/chronicle"
 interface CommentsProps {
  userCommentsData: UserComment[]; // Array of comments
}
export default function Comments({userCommentsData} :CommentsProps) {
  return (
    <>
      <div className="comments mt-1 bg-sky-300 p-4">
        {userCommentsData.map((comment) => (
          <div key={comment._id}>
            <p className="text-gray-500">{comment.comment}</p>fff
          </div>
        ))}
      </div>
    </>
  );
}

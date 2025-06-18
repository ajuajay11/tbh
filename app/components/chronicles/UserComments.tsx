'use client'
import axios from "axios";
import { useState, FormEvent } from "react";
import Cookies from "js-cookie";
type Comment = {
  _id: string;
  comment?: string;
  createdAt: string;
  user?: { name?: string };
};
type UserCommentsProps = {
  Pid: string;       // use `string` — since `_id` is a MongoDB ID
  comments: Comment[];
};
function  UserComments({ Pid, comments }: UserCommentsProps) {
const token = Cookies.get('token');
  const [addcomments, setComments] = useState("")
  const addCommentsFn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
     try {
      const response = await axios.post(`/api/addChronicles/${Pid}/comments/`, {
        comment: addcomments
      }, {
        headers: {
          "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        }
      });
      console.log(response,'responseresponse');
      
    } catch (error) {
      console.log(error, 'addComments');
    }
  }
  return (
    <>
      <div>UserComments</div>
      <div>
        <form onSubmit={addCommentsFn}>
          <input type="text" placeholder="add Comments" value={addcomments} onChange={(e) => setComments(e.target.value)} />
          <input type="submit"className="button bg-dark" value="submit" />
        </form>
      </div>
      {comments.map((e) => (
        <div key={e._id}>{e._id}</div>
      ))}
    </>
  )
}

export default UserComments;
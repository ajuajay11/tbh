// types/chronicle.ts

export interface User {
  _id: string;
  firstname: string;
  lastname: string;
  username: string;
  name:string,
  userId:string
}

export interface UserComment {
  _id: string;
  comment: string;
  createdAt: string;
  user: User;
}

export interface UserLike {
  _id: string;
  user: User;
  likeCount:number
}

export interface Chronicle {
  _id: string;
  yourStoryTitle: string;
  chroniclesOfYou: string;
  incidentFrom: string;
  replyAllowed: boolean;
  comments: boolean;
  emailAllowed: boolean;
  likeCount: number;
  status: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  user?: User;
  UserComments?: UserComment[];
  UserLikes?: UserLike[];
}

export interface ChronicleResponse {
  limitedChronicles: Chronicle[];
}

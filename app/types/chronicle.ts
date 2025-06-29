// types/chronicle.ts
export type Comment = {
  _id: string;
  comment?: string;
  createdAt: string;
  user?: { name?: string };
};

export type Like = {
  _id: string;
  like: boolean;
  createdAt: string;
  user?: { name?: string };
};

export type Chronicle = {
  _id: string;
  yourStoryTitle: string;
  chroniclesOfYou: string;
  replyAllowed: boolean;
  comments: boolean;
  emailAllowed: boolean;
  createdAt: string;
  likeCount: number;
  UserLikes: Like[];
  UserComments: Comment[];
};

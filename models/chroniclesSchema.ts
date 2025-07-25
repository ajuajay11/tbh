import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { IUser } from "@/models/users"; // Adjust path as needed

export interface IUserComment {
  user: {
    userId: string;
    name?: string;
  };
  comment: string;
  createdAt?: Date;
}

export interface IUserLikes {
  user: {
    userId: string;
    name?: string;
  };
  like: boolean;
  createdAt?: Date;
}

export interface IReportEntry {
   user: {
    userId: string;
    name?: string;
  };
  reason: string;
  createdAt?: Date;
}

export interface IUserStory extends Document {
  yourStoryTitle?: string;
  chroniclesOfYou: string;
  replyAllowed: boolean;
  incidentFrom: string;
  UserComments: IUserComment[];
  UserLikes: IUserLikes[];
  comments: boolean;
  reportedBy: IReportEntry[];
  emailAllowed: boolean;
  user: Types.ObjectId | IUser;
  likeCount: number;
  createdAt?: Date;
  status?: number; // 1 = normal, 2 = reported, 3 = removed, etc.
}

const DarkTruth: Schema<IUserStory> = new Schema(
  {
    yourStoryTitle: { type: String, required: true },
    chroniclesOfYou: { type: String, required: true },
    incidentFrom: { type: String, required: true },
    replyAllowed: { type: Boolean, required: true },
    comments: { type: Boolean },
    UserComments: {
      type: [
        {
          user: {
            userId: { type: String },
            name: { type: String },
          },
          comment: { type: String },
          createdAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
    UserLikes: {
      type: [
        {
          user: {
            userId: { type: String },
            name: { type: String },
          },
          like: { type: Boolean, default: false },
          createdAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
    likeCount: { type: Number, default: 0 },
    emailAllowed: { type: Boolean, required: true },
    user: { type: Schema.Types.ObjectId, ref: "Users" },
    createdAt: { type: Date, default: Date.now },
    status: { type: Number, default: 1 },
    reportedBy: {
       type: [
        {
          user: {
            userId: { type: String },
            name: { type: String },
          },
          reason: { type: String },
          createdAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

const UserVibesModel: Model<IUserStory> =
  mongoose.models.DarkTruth ||
  mongoose.model<IUserStory>("DarkTruth", DarkTruth);
export default UserVibesModel;

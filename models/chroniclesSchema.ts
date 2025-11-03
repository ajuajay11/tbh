import mongoose, { Schema, Document, Types } from "mongoose";
import { IUser } from "@/models/users"; // Adjust path as needed

export interface IUserComment {
  user: {
    userId: string;
    name?: string;
  };
  comment: string;
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
  UserLikes: string[]; //
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
      type: [String],
      default: [],
    },
    likeCount: { type: Number, default: 0 },
    emailAllowed: { type: Boolean, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
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

const UserVibesModel =
  mongoose.models?.DarkTruth ||
  mongoose.model<IUserStory>("DarkTruth", DarkTruth);

export default UserVibesModel;

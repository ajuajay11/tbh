import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUserStory  extends Document {
  yourStoryTitle?: string;
  chroniclesOfYou: string;
  replyAllowed: boolean;
  comments: boolean;
  emailAllowed: boolean;
  user: string;
  createdAt?: Date;
}

const DarkTruth: Schema<IUserStory> = new Schema({
  yourStoryTitle: { type: String, required: true, unique: true },
  chroniclesOfYou: { type: String, required: true },
  replyAllowed: { type: Boolean, required: true },
  comments: { type: Boolean},
  emailAllowed: { type: Boolean, required: true },
  user: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// 3. Export the model with type safety
const UserVibesModel:Model<IUserStory> = mongoose.models.DarkTruth || mongoose.model<IUserStory>("DarkTruth", DarkTruth);

export default UserVibesModel;
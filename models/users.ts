import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  gender: string;
  profilePicture?: string;
  age?: number;
  username?: string;
  role: 'unsubscribed' | 'subscribed';
  createdAt: Date;
}

const UserSchema: Schema<IUser> = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  gender: { type: String, required: true },
  profilePicture: { type: String },
  age: { type: Number },
  username:{type:String},
  role: { type: String, enum: ['unsubscribed', 'subscribed'], default: 'unsubscribed' },
  createdAt: { type: Date, default: Date.now }
});

// 3. Export the model with type safety
const User: Model<IUser> = mongoose.models.Users || mongoose.model<IUser>("Users", UserSchema);

export default User;
import mongoose, { Schema, Document, Model } from "mongoose";

export interface Inotification extends Document {
  message: string;
  email: string;
  createdAt: Date;
  expiredAt: Date;
}
const Message: Schema<Inotification> = new Schema({
  message: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 2.628e+6 }
});

const Otp: Model<Inotification> = mongoose.models.notification || mongoose.model<Inotification>("Notification", Message);
export default Otp;
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IotpManager extends Document {
  otp: string;
  email: string;
  createdAt: Date;
  expiredAt: Date;
}

const OtpSchema: Schema<IotpManager> = new Schema({
  otp: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  createdAt: { 
    type: Date, 
    default: Date.now,
    expires: 300
  }
});

// 3. Export the model with type safety
const Otp: Model<IotpManager> = mongoose.models.OtpManager || mongoose.model<IotpManager>("OtpManager", OtpSchema);

export default Otp;

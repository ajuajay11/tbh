import mongoose, { Schema} from "mongoose";

export interface IUserMode {
  mode: boolean;
  comment: string;
  createdAt?: Date;
}
 
const MaintenanceMode: Schema<IUserMode> = new Schema({
    mode: { type: Boolean, required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true })

const maintenanceMode = mongoose.models?.Maintenance || mongoose.model<IUserMode>("Maintenance", MaintenanceMode);

export default maintenanceMode;
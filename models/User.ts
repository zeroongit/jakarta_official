import mongoose, { Schema, Document, models, model } from "mongoose";


export interface IUser extends Document {
  communityId: string;
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
  password?: string;
  otp?: string;
  otpExpires?: Date;
  verified: boolean;
  resetOtp?: string;
  resetOtpExpires?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    communityId: {
      type: String,
      required: true,
      unique: true,
      default: () => `JKT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, default: "" },
    profileImage: { type: String, default: "/images/default-avatar.jpg" },
    password: { type: String },
    otp: { type: String },
    otpExpires: { type: Date },
    verified: { type: Boolean, default: false },
    resetOtp: { type: String },
    resetOtpExpires: { type: Date },

  },
  { timestamps: true }
);

const User = models.User || model<IUser>("User", UserSchema);

export default User;

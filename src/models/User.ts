import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: "admin" | "professor" | "student";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, ""],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+0\S+\.\S+$/, "يرجى إدخال بريد إلكتروني صحيح"],
    },
    password: {
      type: String,
      required: [true, "كلمة المرور مطلوبة"],
      minlength: [8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"],
    },
    name: {
      type: String,
      required: [true, " الاسم مطلوب"],
      trim: true,
      minlength: [2, "الاسم يجب أن يكون حرفين على الأقل"],
    },
    role: {
      type: String,
      enum: ["admin", "professor", "student"],
      default: "student",
    },
  },
  {
    timestamps: true,
  },
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("UserSchema", UserSchema);

export default User;

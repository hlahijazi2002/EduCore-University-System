import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IGraduateProgram extends Document {
  title: string;
  description: string;
  requirements: string;
  duration: string;
  startDate: Date;
  type: "master" | "phd";
  coordinator?: Types.ObjectId;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const GraduateProgramSchema = new Schema<IGraduateProgram>(
  {
    title: {
      type: String,
      required: [true, "عنوان البرنامج مطلوب"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "وصف البرنامج مطلوب"],
      trim: true,
    },
    requirements: {
      type: String,
      required: [true, "متطلبات القبول مطلوبة"],
    },
    duration: {
      type: String,
      required: [true, " مدة البرنامج مطلوبة"],
    },
    startDate: {
      type: Date,
      required: [true, "تاريخ البدء مطلوب"],
    },
    type: {
      type: String,
      enum: ["master", "phd"],
      required: true,
    },
    coordinator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const GraduateProgram: Model<IGraduateProgram> =
  mongoose.models.GraduateProgram ||
  mongoose.model<IGraduateProgram>(
    "GraduateProgramSchema",
    GraduateProgramSchema,
  );

export default GraduateProgram;

import mongoose, { Schema, Document, Model, Types } from "mongoose";
export interface IGrade {
  student: Types.ObjectId;
  grade: number;
  comment?: string;
  gradedAt: Date;
}

export interface ICourse extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  code: string;
  professor: Types.ObjectId;
  students: Types.ObjectId[];
  grades: IGrade[];
  semester: string;
  year: number;
  credits: number;
  type: "undergraduate" | "graduate" | "online";
  requirements?: string;
  schedule?: string;
  learningOutcomes?: string[];
  format?: string;
  materials: { title: string; url: string; type: string }[];
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const GradeSchema = new Schema<IGrade>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    grade: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    comment: {
      type: String,
      trim: true,
    },
    gradedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  },
);

const CourseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: [true, "عنوان المادة مطلوب"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    code: {
      type: String,
      unique: true,
      required: [true, "رمز المادة مطلوب"],
      trim: true,
      uppercase: true,
    },
    professor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "الأستاذ مطلوب"],
    },
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    grades: [GradeSchema],
    semester: {
      type: String,
      required: true,
      enum: ["الفصل الأول", "الفصل الثاني", "الفصل الصيفي"],
    },
    year: {
      type: Number,
      required: true,
    },
    credits: {
      type: Number,
      required: true,
      min: 1,
      max: 6,
    },
    type: {
      type: String,
      enum: ["undergraduate", "graduate", "online"],
      default: "undergraduate",
      required: true,
    },
    requirements: {
      type: String,
      trim: true,
    },
    schedule: {
      type: String,
      trim: true,
    },
    learningOutcomes: [
      {
        type: String,
        trim: true,
      },
    ],
    format: {
      type: String,
      trim: true,
    },
    materials: [
      {
        title: String,
        type: String,
        url: String,
      },
    ],
    image: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);
const Course: Model<ICourse> =
  mongoose.models.Course || mongoose.model<ICourse>("Course", CourseSchema);

export default Course;

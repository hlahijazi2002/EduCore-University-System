import { NextResponse } from "next/server";
import dbConnect from "@/lib/mangodb";
import Course from "@/models/Course";
import { getSession } from "@/lib/auth";
import { createCourseSchema } from "@/lib/validations";

export const GET = async () => {
  try {
    await dbConnect();
    const courses = await Course.find({ type: "online" })
      .populate("professor", "name email")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      courses: courses.map((course) => ({
        id: course._id.toString(),
        title: course.title,
        description: course.description,
        code: course.code,
        professor: course.professor,
        credits: course.credits,
        image: course.image,
      })),
    });
  } catch (error) {
    console.error("Get online courses error:", error);
    return NextResponse.json(
      { success: false, message: "حدث خطأ" },
      { status: 500 },
    );
  }
};

export const POST = async (request: Request) => {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "غير مصرح" },
        { status: 401 },
      );
    }

    if (session.role === "student") {
      return NextResponse.json(
        { success: false, message: "غير مصرح" },
        { status: 403 },
      );
    }

    await dbConnect();

    const body = await request.json();
    body.type = "online";

    const validationResult = createCourseSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((e) => e.message);

      return NextResponse.json(
        { success: false, message: " " },
        { status: 400 },
      );
    }

    const { code } = validationResult.data;
    const existingUser = await Course.findOne({ code: code.toUpperCase() });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "  رمز الدورة التعليمية موجود مسبقاً" },
        { status: 400 },
      );
    }

    const course = await Course.create({
      ...validationResult.data,
      code: code.toUpperCase(),
      professor: session.userId,
      students: [],
      grades: [],
      materials: [],
    });

    return NextResponse.json({
      success: true,
      message: "تم إنشاء الدورة التعليمية بنجاح",
      course: {
        id: course._id.toString(),
        title: course.title,
      },
    });
  } catch (error) {
    console.error("Create online courses error:", error);
    return NextResponse.json(
      { success: false, message: "حدث خطأ" },
      { status: 500 },
    );
  }
};

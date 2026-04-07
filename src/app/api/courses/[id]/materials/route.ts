import { NextResponse } from "next/server";
import dbConnect from "@/lib/mangodb";
import Course from "@/models/Course";
import { getSession } from "@/lib/auth";
import { addMaterialSchema } from "@/lib/validations";

export const POST = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "غير مصرح" },
        { status: 401 },
      );
    }
    const { id } = await params;
    await dbConnect();
    const course = await Course.findById(id);

    if (!course) {
      return NextResponse.json(
        { success: false, message: "الدورة التعليمية غير موجودة" },
        { status: 404 },
      );
    }

    if (
      session.role !== "admin" &&
      course.professor.toString() !== session.userId
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "غير مصرح لك بإضافة مواد لهذه الدورة التعليمية",
        },
        { status: 403 },
      );
    }

    const body = await request.json();

    const validationResult = addMaterialSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((e) => e.message);
      return NextResponse.json(
        { success: false, message: errors[0] },
        { status: 400 },
      );
    }
    course.materials.push(validationResult.data);
    await course.save();

    return NextResponse.json({
      success: true,
      message: "تم إضافة المادة",
      course,
    });
  } catch (error) {
    console.error("Add materials error:", error);
    return NextResponse.json(
      { success: false, message: "حدث خطأ" },
      { status: 500 },
    );
  }
};

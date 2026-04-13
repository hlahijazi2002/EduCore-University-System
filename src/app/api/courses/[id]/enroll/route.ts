import { NextResponse } from "next/server";
import dbConnect from "@/lib/mangodb";
import Course from "@/models/Course";
import { getSession } from "@/lib/auth";

export const POST = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "يجب تسجيل الدخول أولاً" },
        { status: 401 },
      );
    }

    const { id } = await params;
    const studentId = (session as any).userId;

    await dbConnect();

    const course = await Course.findById(id);

    if (!course) {
      return NextResponse.json(
        { success: false, message: "المادة غير موجودة" },
        { status: 404 },
      );
    }

    const isAlreadyEnrolled = course.students.some(
      (id: any) => id.toString() === studentId.toString(),
    );

    if (isAlreadyEnrolled) {
      return NextResponse.json(
        { success: false, message: "أنت مسجل بالفعل في هذه المادة" },
        { status: 400 },
      );
    }

    await Course.findByIdAndUpdate(id, {
      $addToSet: { students: studentId },
    });

    return NextResponse.json({
      success: true,
      message: "تم التسجيل في المادة بنجاح",
    });
  } catch (error) {
    console.error("Enrollment Error:", error);
    return NextResponse.json(
      { success: false, message: "فشل في عملية التسجيل" },
      { status: 500 },
    );
  }
};

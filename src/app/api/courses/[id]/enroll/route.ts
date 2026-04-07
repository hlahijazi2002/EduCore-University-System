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
        { success: false, message: "غير مصرح" },
        { status: 401 },
      );
    }

    const { id } = await params;
    const { studentId } = await request.json();

    await dbConnect();

    const course = await Course.findById(id);

    if (!course) {
      return NextResponse.json(
        { success: false, message: "الدورة التعليمية غير موجودة" },
        { status: 404 },
      );
    }

    const isProfessor = course.professor.toString() === session.userId;
    const isAdmin = session.role === "admin";
    const isSelfEnroll =
      session.role === "student" && session.userId === studentId;

    if (!isProfessor && !isAdmin && !isSelfEnroll) {
      return NextResponse.json(
        { success: false, message: "غير مصرح بتسجيل الطلاب" },
        { status: 403 },
      );
    }

    if (course.students.includes(studentId)) {
      return NextResponse.json(
        {
          success: false,
          message: "الطالب مسجل بالفعل في هذه الدورة التعليمية",
        },
        { status: 403 },
      );
    }

    course.students.push(studentId);
    await course.save();

    return NextResponse.json({
      success: true,
      message: "تم تسجيل الطالب بنجاح ",
      course,
    });
  } catch (error) {
    console.error("Add Student error:", error);
    return NextResponse.json(
      { success: false, message: "حدث خطأ" },
      { status: 500 },
    );
  }
};

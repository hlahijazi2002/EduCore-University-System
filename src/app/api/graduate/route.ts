import { NextResponse } from "next/server";
import dbConnect from "@/lib/mangodb";
import GraduateProgram from "@/models/GraduateProgram";
import { getSession } from "@/lib/auth";
import { createGraduateProgramSchema } from "@/lib/validations";

export const GET = async () => {
  try {
    await dbConnect();
    const programs = await GraduateProgram.find()
      .populate("coordinator", "name email")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, programs });
  } catch (error) {
    console.error("Get users error:", error);
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
    const validationResult = createGraduateProgramSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((e) => e.message);
      return NextResponse.json(
        { success: false, message: errors[0] },
        { status: 400 },
      );
    }

    const program = await GraduateProgram.create({
      ...validationResult.data,
      coordinator: session.userId,
    });

    return NextResponse.json({
      success: true,
      message: "تم إنشاء البرنامج بنجاح",
      program,
    });
  } catch (error) {
    console.error("Create graduate program error:", error);
    return NextResponse.json(
      { success: false, message: "حدث خطأ" },
      { status: 500 },
    );
  }
};

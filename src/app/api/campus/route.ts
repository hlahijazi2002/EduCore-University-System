import { NextResponse } from "next/server";
import dbConnect from "@/lib/mangodb";
import CampusEvent from "@/models/CampusEvents";
import { getSession } from "@/lib/auth";
import { createCampusEventSchema } from "@/lib/validations";

export const GET = async () => {
  try {
    await dbConnect();
    const events = await CampusEvent.find().sort({ date: -1 }).lean();
    return NextResponse.json({ success: true, events });
  } catch (err) {
    console.error("Get campus events error:", err);
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

    const validationResult = createCampusEventSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((e) => e.message);
      return NextResponse.json(
        { success: false, message: errors[0] },
        { status: 400 },
      );
    }

    const event = await CampusEvent.create(validationResult.data);
    return NextResponse.json({
      success: true,
      message: "تم إنشاء الفعالية بنجاح",
      event,
    });
  } catch (err) {
    console.error("Create campus event error:", err);
    return NextResponse.json(
      { success: false, message: "حدث خطأ" },
      { status: 500 },
    );
  }
};

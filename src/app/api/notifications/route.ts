import { NextResponse } from "next/server";
import dbConnect from "@/lib/mangodb";
import Notification from "@/models/Notification";
import { getSession } from "@/lib/auth";

export const GET = async () => {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "غير مصرح" },
        { status: 401 },
      );
    }

    await dbConnect();
    const notifications = await Notification.find({ userId: session.userId })
      .sort({ createdAt: -1 })
      .limit(50);
    return NextResponse.json(notifications);
  } catch (err) {
    console.error("Create user error:", err);
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

    const body = await request.json();
    const { message, type, link, userId } = body;

    await dbConnect();

    const targetUserId =
      session.role === "admin" && userId ? userId : session.userId;

    const notification = await Notification.create({
      userId: targetUserId,
      message,
      type: type || "info",
      link,
    });

    return NextResponse.json(notification);
  } catch (err) {
    console.error("Notification created error:", err);
    return NextResponse.json(
      { success: false, message: "حدث خطأ أثناء إنشاء الإشعار" },
      { status: 500 },
    );
  }
};

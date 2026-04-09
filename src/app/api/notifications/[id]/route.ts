import { NextResponse } from "next/server";
import dbConnect from "@/lib/mangodb";
import Notification from "@/models/Notification";
import { getSession } from "@/lib/auth";

export const PUT = async (
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

    const notification = await Notification.findByIdAndUpdate(
      { _id: id, userId: session.userId },
      { isRead: true },
      { new: true },
    );

    if (!notification) {
      return NextResponse.json(
        { error: "هذا الإشعار غير موجود" },
        { status: 404 },
      );
    }

    return NextResponse.json(notification);
  } catch (err) {
    console.error("Notification update error:", err);
    return NextResponse.json(
      { success: false, message: "حدث خطأ" },
      { status: 500 },
    );
  }
};

export const DELETE = async (
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

    const result = await Notification.deleteOne({
      _id: id,
      userId: session.userId,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "هذا الإشعار غير موجود" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Notification delete error:", err);
    return NextResponse.json(
      { success: false, message: "حدث خطأ" },
      { status: 500 },
    );
  }
};

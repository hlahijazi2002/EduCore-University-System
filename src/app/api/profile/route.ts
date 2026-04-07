import { NextResponse } from "next/server";
import dbConnect from "@/lib/mangodb";
import User from "@/models/User";
import { getSession } from "@/lib/auth";

export const GET = async () => {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(session.userId).select("-password");

    if (!user) {
      return NextResponse.json(
        { error: "المستخدم غير موجود" },
        { status: 404 },
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب البيانات" },
      { status: 500 },
    );
  }
};

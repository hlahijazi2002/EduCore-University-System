import { NextResponse } from "next/server";
import dbConnect from "@/lib/mangodb";
import User from "@/models/User";
import { getSession } from "@/lib/auth";
import { hashPassword } from "@/lib/password";

export const PUT = async (request: Request) => {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, password } = body;

    await dbConnect();

    if (email) {
      const existingUser = await User.findOne({
        email,
        _id: { $ne: session.userId },
      });
      if (existingUser) {
        return NextResponse.json(
          { error: "البريد الإلكتروني مستخدم بالفعل" },
          { status: 400 },
        );
      }
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) {
      updateData.password = await hashPassword(password);
    }

    const user = await User.findByIdAndUpdate(session.userId, updateData, {
      new: true,
    }).select("-password");

    if (!user) {
      return NextResponse.json(
        { error: "المستخدم غير موجود" },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "تم تحديث البيانات بنجاح",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء تحديث البيانات" },
      { status: 500 },
    );
  }
};

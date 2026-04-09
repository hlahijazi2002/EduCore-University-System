import { NextResponse } from "next/server";
import dbConnect from "@/lib/mangodb";
import User from "@/models/User";
import { signToken, setAuthCookie } from "@/lib/auth";
import { hashPassword } from "@/lib/password";
import { signupSchema } from "@/lib/validations";

export const POST = async (request: Request) => {
  try {
    await dbConnect();
    const body = await request.json();
    console.log("البيانات القادمة من الفرونت إند:", body);

    const validationResult = signupSchema.safeParse(body);
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((e) => e.message);
      return NextResponse.json(
        { success: false, message: errors[0] },
        { status: 400 },
      );
    }
    const { email, password, name, role } = validationResult.data;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "هذا المستخدم مسجل سابقاً" },
        { status: 400 },
      );
    }
    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      role,
    });

    const token = await signToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    });
    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      message: "",
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Signup error", error);
    return NextResponse.json(
      { success: false, message: "حدث خطأ أثناء التحميل" },
      { status: 500 },
    );
  }
};

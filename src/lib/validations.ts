import { z } from "zod";
export const signupSchema = z.object({
  email: z
    .string()
    .email("يرجى إدخال بريد الكتروني صحيح")
    .min(1, "البريد الالكتروني مطلوب"),
  password: z
    .string()
    .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
    .regex(/[A-Z]/, "كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل")
    .regex(/[0-9]/, "كلمة المرور يجب أن تحتوي على رقم واحد على الأقل"),
  name: z
    .string()
    .min(2, "الاسم يجب أن يتكون من حرفين على الأقل")
    .max(50, "الاسم طويل جداً"),
  role: z.enum(["admin", "professor", "student"], {
    message: "يرجى اختيار دور صحيح",
  }),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email("يرجى إدخال بريد الكتروني صحيح")
    .min(1, "البريد الالكتروني مطلوب"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  email: z.string().email().optional(),
  role: z.enum(["admin", "professor", "student"]).optional(),
});

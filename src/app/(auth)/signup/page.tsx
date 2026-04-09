"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Mail,
  Lock,
  Loader2,
  User,
  Eye,
  EyeOff,
  ChevronDown,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignupInput, signupSchema } from "@/lib/validations";
import { error } from "console";

const roles = [
  { value: "student", label: "طالب" },
  { value: "professor", label: "أستاذ" },
  { value: "admin", label: "مدير" },
];
const Signup = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isCheckedAuth, setIsCheckedAuth] = React.useState(true);

  React.useEffect(() => {
    async function checkAuth() {
      try {
        const result = await fetch("/api/auth/me");
        const data = await result.json();
        if (data.success) {
          router.replace("/");
          return;
        }
      } catch {}
      setIsCheckedAuth(false);
    }
    checkAuth();
  }, [router]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignupInput) => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success("تم إنشاء الحساب بنجاح");
      router.push(`/dashboard/${result.user.role}`);
    } catch {
      toast.error("حدث خطأ غير متوقع");
    }
  };

  if (isCheckedAuth) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center py-12 px-4 min-h-[80vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="glass-card border-primary/10">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto bg-primary p-3 rounded-xl">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl"> إنشاء حساب</CardTitle>
              <CardDescription className="mt-2">
                أنشئ حسابك للوصول إلى نظام إدارة الجامعة
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="name" className="text-sm font-medium">
                  الاسم الكامل
                </label>
                <div className="relative mt-2">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    id="text"
                    type="text"
                    placeholder="أحمد محمد"
                    className={cn(
                      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background",
                      "file:border-0 file:bg-transparent file:text-sm file:font-medium",
                      "placeholder:text-muted-foreground",
                      "focus-visible:outline-none focus-visible:border-primary",
                      "disabled:cursor-not-allowed disabled:opacity-50",
                      errors.name &&
                        "border-destructive focus-visible:ring-destructive",
                    )}
                    {...register("name")}
                    disabled={isSubmitting}
                    dir="ltr"
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-destructive">
                    {" "}
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="email" className="text-sm font-medium">
                  البريد الإلكتروني
                </label>
                <div className="relative mt-2">
                  <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className={cn(
                      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background",
                      "file:border-0 file:bg-transparent file:text-sm file:font-medium",
                      "placeholder:text-muted-foreground",
                      "focus-visible:outline-none focus-visible:border-primary",
                      "disabled:cursor-not-allowed disabled:opacity-50",
                      errors.email &&
                        "border-destructive focus-visible:ring-destructive",
                    )}
                    {...register("email")}
                    disabled={isSubmitting}
                    dir="ltr"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {" "}
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="password" className="text-sm font-medium">
                  كلمة السر
                </label>
                <div className="relative mt-2">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className={cn(
                      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 pl-8 text-sm ring-offset-background",
                      "file:border-0 file:bg-transparent file:text-sm file:font-medium",
                      "placeholder:text-muted-foreground",
                      "focus-visible:outline-none focus-visible:border-primary",
                      "disabled:cursor-not-allowed disabled:opacity-50",
                    )}
                    {...register("password")}
                    disabled={isSubmitting}
                    dir="ltr"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/4  text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="password" className="text-sm font-medium">
                  تأكيد كلمة السر
                </label>
                <div className="relative mt-2">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className={cn(
                      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 pl-8 text-sm ring-offset-background",
                      "file:border-0 file:bg-transparent file:text-sm file:font-medium",
                      "placeholder:text-muted-foreground",
                      "focus-visible:outline-none focus-visible:border-primary",
                      "disabled:cursor-not-allowed disabled:opacity-50",
                    )}
                    {...register("password")}
                    disabled={isSubmitting}
                    dir="ltr"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/4  text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="role" className="text-sm font-medium">
                  نوع الحساب
                </label>
                <div className="relative">
                  <select
                    id="role"
                    className={cn(
                      "flex h-10 w-full mt-2 rounded-md border border-input bg-background px-3 py-2 text-sm transition-colors cursor-pointer appearance-none",
                      "focus-visible:outline-none focus-visible:border-primary",
                      "disabled:cursor-not-allowed disabled:opacity-50",
                    )}
                    {...register("role")}
                    disabled={isSubmitting}
                  >
                    {roles.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </div>

                {errors.email && (
                  <p className="text-sm text-destructive">
                    {" "}
                    {errors.email.message}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    جارِ إنشاء الحساب ...
                  </>
                ) : (
                  "إنشاء حساب"
                )}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                لديك حساب بالفعل؟
                <Link href="/login" className="font-medium mr-1">
                  تسجيل الدخول
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Signup;

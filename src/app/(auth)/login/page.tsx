"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap, Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react";
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
import { loginSchema, LoginInput } from "@/lib/validations";

const LoginPage = () => {
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
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success("تم تسجيل الدخول بنجاح");
      router.push(`dashboard/${result.user.role}`);
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
            <div className="mx-auto bg-primary p-3 rounded-xl ">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">مرحباَ بعودتك</CardTitle>
              <CardDescription className="mt-2">
                قم بتسجيل الدخول للوصول إلى حسابك
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="email" className="text-sm font-medium ">
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
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    جارِ تسجيل الدخول ...
                  </>
                ) : (
                  "تسجيل الدخول"
                )}
              </Button>
              <p className="text-center  text-sm text-muted-foreground">
                أليس لديك حساب؟
                <Link href="/signup" className="font-medium mr-1">
                  إنشاء حساب جديد
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;

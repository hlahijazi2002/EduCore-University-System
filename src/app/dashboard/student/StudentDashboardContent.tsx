"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const StudentDashboardContent = () => {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    const fetchEnrolledCourse = async () => {
      try {
        const res = await fetch("/api/courses");
        const data = await res.json();
        if (data.success) {
          setCourses(data.courses);
        }
      } catch (error) {
        console.error("Error fetching courses", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrolledCourse();
  }, []);

  if (loading) {
    return <div>جارِ تحميل مقرراتك</div>;
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 border border-dashed rounded-lg my-8">
        <p className="text-xl text-gray-500 mb-4">
          أنت غير مسجل في أي دورات حالياً
        </p>
        <Link href="/courses">
          <Button>تصفح الدورات التعليمية المتاحة</Button>
        </Link>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
      {courses.map((course) => (
        <Card key={course.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>{course.title}</CardTitle>
            <CardDescription>
              {course.code} | {course.professor?.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>الدرجة / التقيم</span>
                <span>
                  {course.myGrade !== undefined
                    ? `${course.myGrade}`
                    : "لم يتم التقييم"}
                </span>
              </div>
              <Progress value={course.myGrade || 0} className="h-2" />
            </div>
            {course.materials && course.materials.length > 0 && (
              <div className="text-sm text-gray-500">
                {course.materials.length} دورات تعليمية
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href={`/courses/${course.id}`}>
                الدخول للدورة التعليمية
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default StudentDashboardContent;

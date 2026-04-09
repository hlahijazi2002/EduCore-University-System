import { Suspense } from "react";
import CoursesList from "@/components/courses/CoursesList";
const UndergraduatePage = () => {
  return (
    <div className="container mx-auto py-10 px-4" dir="rtl">
      <h1 className="text-3xl font-bold mb-0 text-primary">برامج البكالوريس</h1>
      <p className="text-xl text-gray-500 max-w-2xl mx-auto">
        استكشف مجموعة متنوعة من التخصصات المصممة لبناء مستقبلك المهني{" "}
      </p>
      <Suspense fallback={<DashboardSkeleton />}>
        <CoursesList type="undergraduate" />
      </Suspense>
    </div>
  );
};

export default UndergraduatePage;

const DashboardSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="h-48 w-full bg-gray-200 animate-pulse rounded-xl"
      />
    ))}
  </div>
);

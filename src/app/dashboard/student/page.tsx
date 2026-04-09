import { Suspense } from "react";
import StudentDashboardContent from "./StudentDashboardContent";

const StudentDashboardPage = () => {
  return (
    <div className="container mx-auto py-10 px-4" dir="rtl">
      <h1 className="text-3xl font-bold mb-0 text-primary">لوحة تحكم الطالب</h1>
      <Suspense fallback={<DashboardSkeleton />}>
        <StudentDashboardContent />
      </Suspense>
    </div>
  );
};

export default StudentDashboardPage;

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

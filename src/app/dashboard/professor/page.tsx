import { Suspense } from "react";
import ProfessorDashboardContent from "./ProfessorDahboardContent";

const ProfessorDashboardPage = () => {
  return (
    <div className="container mx-auto py-10 px-4" dir="rtl">
      <h1 className="text-3xl font-bold mb-0 text-primary">
        لوحة تحكم الأستاذ
      </h1>
      <Suspense fallback={<DashboardSkeleton />}>
        <ProfessorDashboardContent />
      </Suspense>
    </div>
  );
};

export default ProfessorDashboardPage;

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

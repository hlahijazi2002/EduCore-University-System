import { notFound } from "next/navigation";
import AdminDashbard from "@/components/dashboard/admin-dashbard";
import ProfessorDashboard from "@/components/dashboard/professor-dashboard";
import StudentDashboard from "@/components/dashboard/student-dashboard";

const roleTitles: Record<string, string> = {
  admin: "لوحة تحكم المدير",
  professor: "لوحة تحكم الأستاذ",
  student: "لوحة تحكم الطالب",
};

export const generateStaticParams = () => {
  return [{ role: "admin" }, { role: "professor" }, { role: "student" }];
};

const DashboardPage = async ({
  params,
}: {
  params: Promise<{ role: string }>;
}) => {
  const { role } = await params;

  let DashboardComponent;

  switch (role) {
    case "admin":
      DashboardComponent = AdminDashbard;
      break;
    case "professor":
      DashboardComponent = ProfessorDashboard;
      break;
    case "student":
      DashboardComponent = StudentDashboard;
      break;
    default:
      return notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {roleTitles[role] || "لوحة التحكم"}
        </h1>
        <p className="text-muted-foreground">مرحباً بك في منصة EduCore.</p>
      </div>

      <DashboardComponent />
    </div>
  );
};

export default DashboardPage;

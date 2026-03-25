"use client";

import useSWR from "swr";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Users,
  DollarSign,
  Activity,
  Book,
  Loader2,
  icons,
} from "lucide-react";
import { fetcher } from "@/lib/api";

const mockChartData = [
  { name: "يناير", students: 40 },
  { name: "فبراير", students: 38 },
  { name: "مارس", students: 20 },
  { name: "أبريل", students: 27 },
  { name: "مايو", students: 18 },
  { name: "يونيو", students: 23 },
  { name: "يوليو", students: 34 },
];

const AdminDashbard = () => {
  const { data: usersData, isLoading: loadingUsers } = useSWR<{ users: any[] }>(
    "/api/users",
    fetcher,
  );
  const { data: coursesData, isLoading: loadingCourses } = useSWR<{
    courses: any[];
  }>("/api/courses?browse=true", fetcher);

  const stats = [
    {
      title: "إجمالي المستخدمين",
      value: loadingUsers ? "..." : usersData?.users.length.toString(),
      icon: Users,
      desc: "مستخدم مسجل",
    },
    {
      title: "الساعات النشطة",
      value: loadingCourses ? "..." : coursesData?.courses.length.toString(),
      icon: Book,
      desc: "ساعة دراسية",
    },
    {
      title: "الطلاب",
      value: loadingUsers
        ? "..."
        : usersData?.users
            .filter((u) => u.role === "student")
            .length.toString(),
      icon: GraduationCapIcon,
      desc: "طالب وطالبة",
    },
    {
      title: "الأساتذة",
      value: loadingUsers
        ? "..."
        : usersData?.users
            .filter((u) => u.role === "professor")
            .length.toString(),
      icon: Activity,
      desc: "عضو هيئة تدريس",
    },
  ];

  return <div>admin-dashbard</div>;
};

export default AdminDashbard;

function GraduationCapIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}

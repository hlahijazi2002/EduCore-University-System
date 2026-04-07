import NotificationList from "@/components/notifications/NotificationList";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

const NotificationsPage = async () => {
  const session = await getSession();
  if (!session) redirect("/login");
  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <div className="flex mb-8 items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-l from-indigo-500 to-purple-600">
            الإشعارات
          </h1>
          <p className="text-muted-foreground mt-2">آخر التحديثات والنشاطات</p>
        </div>
      </div>
      <NotificationList />
    </div>
  );
};

export default NotificationsPage;

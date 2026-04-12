"use client";

import { CampusEventsList } from "@/app/campus/CampusEventsList";
import CoursesList from "@/components/courses/CoursesList";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ExcellencePage = () => {
  return (
    <div className="container mx-auto py-10 px-4" dir="rtl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-4xl bg-clip-text text-transparent bg-linear-to-l from-indigo-500 via-purple-500 to-pink-500 mb-2">
          مركز التميز الجامعي
        </h1>
        <p className="text-muted-foreground">
          وجهتك الشاملة للتفوق الأكاديمي والنشاطات الجامعية
        </p>
      </div>

      <Tabs defaultValue="courses" className="w-full">
        <div className="flex justify-center mb-8" dir="rtl">
          <TabsList className="grid w-[400px] grid-cols-2">
            <TabsTrigger value="courses">المساقات الدراسية</TabsTrigger>
            <TabsTrigger value="events">الفعاليات الجامعية</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="courses">
          <section className="space-y-6" dir="rtl">
            <h2 className="text-2xl font-semibold mb-6">المساقات المتاحة</h2>
            <CoursesList />
          </section>
        </TabsContent>

        <TabsContent value="events">
          <section className="space-y-6" dir="rtl">
            <h2 className="text-2xl font-semibold mb-6">آخر الفعاليات</h2>
            <CampusEventsList />
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExcellencePage;

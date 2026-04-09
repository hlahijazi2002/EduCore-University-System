"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface CampusEvent {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
}

const CampusListPage = () => {
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    image: "",
  });

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/campus");
      const data = await res.json();
      if (data.success) {
        setEvents(data.events);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/campus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        toast.success("تم إضافة الفعالية بنجاح");
        setIsAddOpen(false);
        fetchEvents();
        setFormData({
          title: "",
          description: "",
          date: "",
          location: "",
          image: "",
        });
      } else {
        toast.error(data.message || "حدث خطأ");
      }
    } catch (error) {
      console.error("Error adding events:", error);
      toast.error("حدث خطأ أثناء الاتصال بالخادم");
    }
  };

  return (
    <div className="container mx-auto py-10 px-4" dir="rtl">
      <div className="flex justify-between items-center mb-18">
        <div>
          <h1 className="text-4xl font-bold text-primary mb-2">
            الحياة الجامعية
          </h1>
          <p className="text-gray-600">
            اكتشف الفعاليات والنشاطات في الحرم الجامعي
          </p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>إضافة فعالية</Button>
          </DialogTrigger>
          <DialogContent
            className="max-w-md bg-background text-foreground"
            dir="rtl"
          >
            <DialogHeader>
              <DialogTitle>إضافة فعالية جديدة</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddEvent} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>عنوان الفعالية</Label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  minLength={3}
                />
              </div>

              <div className="space-y-2">
                <Label>الوصف</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                  minLength={10}
                />
              </div>
              <div className="space-y-2">
                <Label>التاريخ</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>الموقع</Label>
                <Input
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>صورة (رابط إختياري)</Label>
                <Input
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>
              <Button type="submit" className="w-full">
                إضافة
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-75 w-full rounded-xl" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div>
          <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed text-gray-500">
            لا توجد فعاليات حالياً
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map((event) => (
            <Card
              key={event._id}
              className="hover:shadow-lg transition-shadow overflow-hidden"
            >
              <div className="h-48 bg-gray-100 relative">
                {event.image ? (
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover h-full w-full"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <span className="text-4xl">🗓️</span>
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-primary shadow-sm">
                  {new Date(event.date).toLocaleDateString("ar-SA")}
                </div>
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-1">{event.title}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <span>📍</span> {event.location}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 line-clamp-3 text-sm">
                  {event.description}
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  التفاصيل
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CampusListPage;

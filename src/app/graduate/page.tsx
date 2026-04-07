"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface GraduateProgram {
  _id: string;
  title: string;
  description: string;
  requirements: string;
  duration: string;
  startDate: string;
  type: "master" | "phd";
  coordinator?: { name: string };
  image: string;
}

interface UserSession {
  role: "admin" | "professor" | "student";
}
const GraduatePage = () => {
  const [programs, setPrograms] = useState<GraduateProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [user, setUser] = useState<UserSession | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    duration: "",
    startDate: "",
    type: "master",
    image: "",
  });

  const fetchPrograms = async () => {
    try {
      const res = await fetch("/api/graduate");
      const data = await res.json();
      if (data.success) {
        setPrograms(data.program);
      }
    } catch (error) {
      console.error("Error fetching programs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };
  useEffect(() => {
    fetchPrograms();
    fetchUser();
  }, []);
  const canAddProgram = user?.role === "admin" || user?.role === "professor";
  const handleAddProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/graduate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        toast.success("تم إضافة البرنامج بنجاح");
        setIsAddOpen(false);
        fetchPrograms();
        setFormData({
          title: "",
          description: "",
          requirements: "",
          duration: "",
          startDate: "",
          type: "master",
          image: "",
        });
      } else {
        toast.error(data.message || "حدث خطأ");
      }
    } catch (error) {
      console.error("Error adding program:", error);
      toast.error("حدث خطأ أثناء الاتصال بالخادم");
    }
  };

  return (
    <div className="container mx-auto py-10 px-4" dir="rtl">
      <div className="flex justify-between items-center mb-18">
        <div>
          <h1 className="text-4xl font-bold text-primary mb-2">
            الدراسات العليا
          </h1>
          <p className="text-gray-600">برامج الماجستير والدكتوراه المتاحة</p>
        </div>
        {canAddProgram && (
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button>إضافة برنامج</Button>
            </DialogTrigger>
            <DialogContent
              className="max-w-lg bg-background text-foreground"
              dir="rtl"
            >
              <DialogHeader>
                <DialogTitle>إضافة برنامج دراسات عليا</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddProgram} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label htmlFor="">اسم البرنامج</label>
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
                  <label htmlFor="">النوع</label>
                  <Select
                    value={formData.title}
                    onValueChange={(value: string) =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="master">ماجستير</SelectItem>
                      <SelectItem value="phd">دكتوراه</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="">الوصف</label>
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
                  <label htmlFor="">متطلبات القبول</label>
                  <Textarea
                    value={formData.requirements}
                    onChange={(e) =>
                      setFormData({ ...formData, requirements: e.target.value })
                    }
                    required
                    placeholder="إذكر المتطلبات الأكاديمية..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="">المدة (بالسنوات)</label>
                    <Input
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: e.target.value })
                      }
                      required
                      placeholder="سنين"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="">تاريخ البدء</label>
                    <Input
                      type="date"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="">صورة (رابط إختياري)</label>
                  <Input
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                    required
                  />
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default GraduatePage;

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
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

export default function ProfessorDashboardContent() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAddMaterialOpen, setIsAddMaterialOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [isViewStudentsOpen, setIsViewStudentsOpen] = useState(false);
  const [selectedCourseStudents, setSelectedCourseStudents] = useState<any[]>(
    [],
  );
  const [viewLoading, setViewLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    code: "",
    description: "",
    semester: "الفصل الأول",
    year: new Date().getFullYear(),
    credits: 3,
    type: "undergraduate",
    requirements: "",
    format: "",
    image: "",
  });

  const [materialData, setMaterialData] = useState({
    title: "",
    url: "",
    type: "lecture",
  });

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/courses");
      const data = await res.json();
      if (data.success) {
        setCourses(data.courses);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = isEditing ? "PUT" : "POST";
    const dataToSend = isEditing
      ? { ...formData, id: currentEditId } // إضافة المعرف للبيانات في حالة التعديل
      : formData;
    try {
      const res = await fetch("/api/courses", {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(
          isEditing ? "تم تحديث المادة بنجاح" : "تم إنشاء المادة بنجاح",
        );
        setIsCreateOpen(false);
        fetchCourses();
        resetForm();
      } else {
        toast.error(data.message || "حدث خطأ");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("حدث خطأ أثناء الاتصال بالخادم");
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentEditId(null);
    setFormData({
      title: "",
      code: "",
      description: "",
      semester: "الفصل الأول",
      year: new Date().getFullYear(),
      credits: 3,
      type: "undergraduate",
      requirements: "",
      format: "",
      image: "",
    });
  };

  const handleAddMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseId) return;
    try {
      const res = await fetch(`/api/courses/${selectedCourseId}/materials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(materialData),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("تم إضافة المحتوى بنجاح");
        setIsAddMaterialOpen(false);
        fetchCourses();
        setMaterialData({ title: "", url: "", type: "lecture" });
      } else {
        toast.error(data.message || "حدث خطأ ما");
      }
    } catch (error) {
      console.error("Error adding material:", error);
      toast.error("حدث خطأ أثناء الاتصال بالخادم");
    }
  };

  const openAddMaterial = (courseId: string) => {
    setSelectedCourseId(courseId);
    setIsAddMaterialOpen(true);
  };

  const openViewStudents = async (courseId: string) => {
    setSelectedCourseId(courseId);
    setIsViewStudentsOpen(true);
    setViewLoading(true);
    try {
      const res = await fetch(`/api/courses/${courseId}`);
      const data = await res.json();
      if (data.success && data.course.students) {
        setSelectedCourseStudents(data.course.students);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("فشل تحميل قائمة الطلاب");
    } finally {
      setViewLoading(false);
    }
  };

  const openEditCourse = (course: any) => {
    setFormData({
      title: course.title,
      code: course.code,
      description: course.description || "",
      semester: course.semester,
      year: course.year,
      credits: course.credits,
      type: course.type,
      requirements: course.requirements || "",
      format: course.format || "",
      image: course.image || "",
    });
    setCurrentEditId(course.id);
    setIsEditing(true);
    setIsCreateOpen(true);
  };
  return (
    <div className="space-y-8 mt-4" dir="rtl">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">موادك الدراسية</h2>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm();
                setIsCreateOpen(true);
              }}
            >
              + إضافة مادة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background text-foreground p-6">
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "تعديل المادة" : "إضافة مادة جديدة"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-5 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>عنوان المادة</Label>
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
                  <Label>رمز المادة</Label>
                  <Input
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                    required
                    placeholder="CS101"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>الوصف</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>الفصل</Label>
                  <Select
                    value={formData.semester}
                    onValueChange={(val) =>
                      setFormData({ ...formData, semester: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="الفصل الأول">الفصل الأول</SelectItem>
                      <SelectItem value="الفصل الثاني">الفصل الثاني</SelectItem>
                      <SelectItem value="الفصل الصيفي">الفصل الصيفي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>السنة</Label>
                  <Input
                    type="number"
                    value={formData.year}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        year: parseInt(e.target.value),
                      })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>الساعات</Label>
                  <Input
                    type="number"
                    value={formData.credits}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        credits: parseInt(e.target.value),
                      })
                    }
                    required
                    min={1}
                    max={6}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>النوع</Label>
                <Select
                  value={formData.type}
                  onValueChange={(val) =>
                    setFormData({ ...formData, type: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="undergraduate">بكالوريوس</SelectItem>
                    <SelectItem value="graduate">دراسات عليا</SelectItem>
                    <SelectItem value="online">أونلاين</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.type === "graduate" && (
                <div className="space-y-2">
                  <Label>المتطلبات</Label>
                  <Textarea
                    value={formData.requirements}
                    onChange={(e) =>
                      setFormData({ ...formData, requirements: e.target.value })
                    }
                    placeholder="أدخل المتطلبات..."
                  />
                </div>
              )}
              {formData.type === "online" && (
                <div className="space-y-2">
                  <Label>الصيغة</Label>
                  <Input
                    value={formData.format}
                    onChange={(e) =>
                      setFormData({ ...formData, format: e.target.value })
                    }
                    placeholder="مسجل، مباشر..."
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label>رابط الصورة</Label>
                <Input
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>
              <Button type="submit" className="w-full">
                {isEditing ? "حفظ التعديلات" : "إنشاء المادة"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{course.title}</CardTitle>
                  <CardDescription>{course.code}</CardDescription>
                </div>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {course.type}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-1 text-gray-600">
                <p>الطلاب: {course.studentsCount || 0}</p>
                <p>
                  الفصل: {course.semester} {course.year}
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <div className="flex gap-2 w-full">
                <Button variant="outline" size="sm" className="flex-1">
                  تعديل
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  onClick={() => openAddMaterial(course.id)}
                >
                  إضافة محتوى
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => openViewStudents(course.id)}
              >
                عرض الطلاب
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div> */}

      <Dialog open={isAddMaterialOpen} onOpenChange={setIsAddMaterialOpen}>
        <DialogContent className="bg-background text-foreground" dir="rtl">
          <DialogHeader>
            <DialogTitle>إضافة محتوى تعليمي</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddMaterial} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>عنوان المحتوى</Label>
              <Input
                value={materialData.title}
                onChange={(e) =>
                  setMaterialData({ ...materialData, title: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>الرابط (URL)</Label>
              <Input
                value={materialData.url}
                onChange={(e) =>
                  setMaterialData({ ...materialData, url: e.target.value })
                }
                required
                type="url"
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label>النوع</Label>
              <Select
                value={materialData.type}
                onValueChange={(val) =>
                  setMaterialData({ ...materialData, type: val })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lecture">محاضرة</SelectItem>
                  <SelectItem value="assignment">واجب</SelectItem>
                  <SelectItem value="reading">قراءة</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">
              حفظ
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewStudentsOpen} onOpenChange={setIsViewStudentsOpen}>
        <DialogContent className="bg-background text-foreground" dir="rtl">
          <DialogHeader>
            <DialogTitle>الطلاب المسجلين</DialogTitle>
          </DialogHeader>
          <div className="mt-4 max-h-[60vh] overflow-y-auto">
            {viewLoading ? (
              <div className="text-center py-4">جاري التحميل...</div>
            ) : selectedCourseStudents.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                لا يوجد طلاب مسجلين.
              </div>
            ) : (
              <ul className="space-y-4">
                {selectedCourseStudents.map((student: any) => (
                  <li
                    key={student._id || student.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold">{student.name}</p>
                      <p className="text-sm text-gray-500">{student.email}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </DialogContent>
      </Dialog>
      {loading ? (
        <div>جارِ تحميل الدورات التعليمية</div>
      ) : courses.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 border border-dashed rounded-lg  my-8">
          <p className="text-gray-500">لم يتم إضافة أي دورات تعليمية بعد</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>{course.title}</CardTitle>
                    <CardDescription>{course.code}</CardDescription>
                  </div>
                  <span className="text-xs px-2 py-1 rounded text-gray-900 bg-gray-200">
                    {course.type}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1 text-gray-600">
                  <p>الطلاب المسجلين {course.studentsCount}</p>
                  <p>
                    الفصل: {course.semester} {course.year}
                  </p>
                  {course.materials && (
                    <p>مواد تعليمية: {course.materials.length}</p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <div className="flex gap-2 w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => openEditCourse(course)}
                  >
                    تعديل
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    onClick={() => openAddMaterial(course.id)}
                  >
                    إضافة محتوى
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => openViewStudents(course.id)}
                >
                  عرض الطلاب المسجلين
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

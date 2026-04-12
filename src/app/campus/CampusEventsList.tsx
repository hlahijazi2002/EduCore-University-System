"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CampusEvent {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image?: string;
}

export const CampusEventsList = () => {
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/campus");
        const data = await res.json();
        if (data.success) {
          setEvents(data.events);
        }
      } catch (error) {
        console.error("Error fetching events", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-75 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div>
        <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed text-gray-500">
          لا توجد فعاليات حالياً
        </div>
      </div>
    );
  }

  return (
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
            <div className="absolute top-4 right-4 bg-primary-foreground text-primary  backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
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
  );
};

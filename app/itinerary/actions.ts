"use server";

import { supabase } from "@/lib/supabase";

export async function fetchItinerary() {
  const { data, error } = await supabase
    .from("itinerary")
    .select("*")
    .order("day", { ascending: true })
    .order("id", { ascending: true });

  if (error) return [];

  // Group by day for the UI
  const grouped = data.reduce((acc: any, item: any) => {
    if (!acc[item.day]) acc[item.day] = [];
    acc[item.day].push(item);
    return acc;
  }, {});

  return Object.keys(grouped).map(day => ({
    day: parseInt(day),
    activities: grouped[day]
  }));
}

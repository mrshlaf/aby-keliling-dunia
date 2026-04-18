"use server";

import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function submitPayment(weekId: number) {
  const session = await getSession();
  if (!session) return { error: "Lo harus login dulu!" };

  const { userId } = session;

  // 1. Get week target amount
  const { data: week } = await supabase
    .from("weeks")
    .select("target_amount")
    .eq("id", weekId)
    .single();

  const amount = week?.target_amount || 35000;

  // 2. Insert or Update contribution
  const { error } = await supabase
    .from("contributions")
    .upsert(
      { 
        user_id: userId, 
        week_id: weekId, 
        amount: amount 
      }, 
      { onConflict: "user_id,week_id" }
    );

  if (error) {
    console.error("Payment Error:", error);
    return { error: "Gagal nyimpen data setoran." };
  }

  revalidatePath("/contributions");
  revalidatePath("/members");
  revalidatePath("/");
  
  return { success: true };
}

export async function fetchUserContributions() {
  const session = await getSession();
  if (!session) return [];

  const { data, error } = await supabase
    .from("contributions")
    .select("*")
    .eq("user_id", session.userId);

  if (error) return [];
  return data;
}

export async function fetchPracticalData() {
  const [budgets, checklists] = await Promise.all([
    supabase.from("budgets").select("*").order("category"),
    supabase.from("checklists").select("*").order("item_name")
  ]);

  return {
    budgets: budgets.data || [],
    checklists: checklists.data || []
  };
}

export async function toggleChecklistItem(itemId: string, isPacked: boolean) {
  const { error } = await supabase
    .from("checklists")
    .update({ is_packed: isPacked })
    .eq("id", itemId);

  if (error) return { error: error.message };
  revalidatePath("/");
  return { success: true };
}

export async function verifyPayment(contributionId: string) {
  const session = await getSession();
  if (session?.role !== 'admin') return { error: "Cuma Admin yang bisa verifikasi!" };

  const { error } = await supabase
    .from("contributions")
    .update({ is_verified: true })
    .eq("id", contributionId);

  if (error) return { error: error.message };
  revalidatePath("/");
  return { success: true };
}

export async function fetchPendingVerifications() {
  const session = await getSession();
  if (session?.role !== 'admin') return [];

  const { data } = await supabase
    .from("contributions")
    .select(`
      *,
      profiles (name, username)
    `)
    .eq("is_verified", false)
    .order("created_at", { ascending: false });

  return data || [];
}

export async function logActivity(userId: string, actionText: string, type: string = 'info') {
  await supabase.from("activity_log").insert([{ user_id: userId, action_text: actionText, type }]);
}

export async function fetchActivityLog() {
  const { data } = await supabase
    .from("activity_log")
    .select(`
      *,
      profiles (name, username)
    `)
    .order("created_at", { ascending: false })
    .limit(10);
  return data || [];
}

export async function fetchAnnouncements() {
  const { data } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false });
  return data || [];
}

export async function fetchAllMembersStatus() {
  const session = await getSession();
  
  // Fetch profiles joined with contributions
  const { data: profiles, error: pError } = await supabase
    .from("profiles")
    .select(`
      id,
      username,
      name,
      role,
      contributions (
        amount
      )
    `)
    .neq("role", "admin"); // Exclude admin from member list unless requested otherwise

  if (pError) return [];

  return profiles.map((p: any) => {
    const total = p.contributions?.reduce((sum: number, c: any) => sum + c.amount, 0) || 0;
    const progress = Math.min(Math.round((total / 210000) * 100), 100);
    return {
      id: p.id,
      name: p.name || p.username,
      username: p.username,
      role: p.role,
      total,
      progress,
      status: total >= 35000 ? "ON TRACK" : "BEHIND"
    };
  });
}

export async function fetchGlobalStats() {
  // Filter out admin and unverified payments
  const { data: contributions } = await supabase
    .from("contributions")
    .select("amount, user_id")
    .eq("is_verified", true);

  const { data: memberCount } = await supabase
    .from("profiles")
    .select("id", { count: 'exact' })
    .neq("role", "admin");

  const total = contributions?.reduce((sum, c) => sum + c.amount, 0) || 0;

  return { total, memberCount: memberCount?.length || 0 };
}

export async function deleteMember(userId: string) {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    return { error: "Cuma Bos Besar yang bisa hapus akun!" };
  }

  if (session.userId === userId) {
    return { error: "Lo nggak bisa hapus akun sendiri, Bos!" };
  }

  const { error } = await supabase
    .from("profiles")
    .delete()
    .eq("id", userId);

  if (error) return { error: error.message };

  revalidatePath("/members");
  revalidatePath("/");
  
  return { success: true };
}

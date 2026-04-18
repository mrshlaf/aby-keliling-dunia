"use server";

import { supabase } from "@/lib/supabase";
import { setSession, clearSession, getSession } from "@/lib/session";

export async function signUpAction(username: string, password: string) {
  const cleanUsername = username.trim().toLowerCase();
  
  // 1. Check if username exists
  const { data: existing } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", cleanUsername)
    .single();

  if (existing) {
    return { error: "Username sudah dipakai!" };
  }

  // 2. Insert new profile
  const { data, error } = await supabase
    .from("profiles")
    .insert([
      { username: cleanUsername, password: password, name: cleanUsername }
    ])
    .select()
    .single();

  if (error) return { error: error.message };

  // 3. Set Session
  await setSession(data.id, data.username, data.role);
  return { success: true };
}

export async function loginAction(username: string, password: string) {
  const cleanUsername = username.trim().toLowerCase();

  // 1. Find user
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", cleanUsername)
    .eq("password", password)
    .single();

  if (error || !data) {
    return { error: "Username atau Password salah!" };
  }

  // 2. Set Session
  await setSession(data.id, data.username, data.role);
  return { success: true };
}

export async function logoutAction() {
  await clearSession();
}

export async function getAuthSession() {
  return await getSession();
}

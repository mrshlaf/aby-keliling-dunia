import { cookies } from "next/headers";

/**
 * Custom Auth Utility for ABY Trip (No-Supabase-Auth version)
 */
export async function setSession(userId: string, username: string, role: string = "member") {
  const cookieStore = await cookies();
  cookieStore.set("aby_user_id", userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  });
  cookieStore.set("aby_username", username, {
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  cookieStore.set("aby_role", role, {
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("aby_user_id")?.value;
  const username = cookieStore.get("aby_username")?.value;
  const role = cookieStore.get("aby_role")?.value || "member";
  
  if (!userId) return null;
  
  return { userId, username, role };
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete("aby_user_id");
  cookieStore.delete("aby_username");
  cookieStore.delete("aby_role");
}

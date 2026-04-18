"use server";

import { supabase } from "@/lib/supabase";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { logActivity } from "../contributions/actions";

export async function fetchPolls() {
  const session = await getSession();
  
  // Fetch polls with their options
  const { data: polls, error } = await supabase
    .from("polls")
    .select(`
      *,
      poll_options (*),
      votes (user_id, option_id)
    `)
    .order("created_at", { ascending: false });

  if (error) return [];

  return polls.map((poll: any) => {
    const totalVotes = poll.votes?.length || 0;
    const userVote = poll.votes?.find((v: any) => v.user_id === session?.userId)?.option_id;

    return {
      ...poll,
      totalVotes,
      voted: userVote,
      options: poll.poll_options.map((opt: any) => {
        const optVotes = poll.votes?.filter((v: any) => v.option_id === opt.id).length || 0;
        return {
          ...opt,
          votes: optVotes
        };
      })
    };
  });
}

export async function castVote(pollId: string, optionId: string) {
  const session = await getSession();
  if (!session) return { error: "Lo harus login dulu!" };

  const { error } = await supabase
    .from("votes")
    .upsert(
      { 
        poll_id: pollId, 
        user_id: session.userId, 
        option_id: optionId 
      },
      { onConflict: "poll_id,user_id" }
    );

  if (error) return { error: "Gagal nyimpen suara lo." };

  // Log Activity
  await logActivity(session.userId, "Baru saja memberikan suara di polling! 🗳️", "vote");

  revalidatePath("/polls");
  revalidatePath("/");
  return { success: true };
}

export async function createPoll(question: string, deadline: string, options: string[]) {
  const session = await getSession();
  if (!session) {
    return { error: "Lo harus login dulu buat bikin polling!" };
  }

  // 1. Create Poll
  const { data: poll, error: pError } = await supabase
    .from("polls")
    .insert([
      { question, deadline, created_by: session.userId }
    ])
    .select()
    .single();

  if (pError) return { error: pError.message };

  // 2. Create Options
  const optionEntries = options
    .filter(opt => opt.trim() !== "")
    .map(text => ({ poll_id: poll.id, option_text: text }));

  const { error: oError } = await supabase
    .from("poll_options")
    .insert(optionEntries);

  if (oError) return { error: oError.message };

  revalidatePath("/polls");
  return { success: true };
}

import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { Poem } from "@/types";

export async function GET() {
  const { data, error } = await supabase
    .from("poems")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const poems: Poem[] = (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    content: row.content,
    author: row.author,
    language: row.language,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));

  return NextResponse.json(poems);
}

export async function POST(request: Request) {
  const body = await request.json();

  const { data, error } = await supabase
    .from("poems")
    .insert({
      title: body.title,
      content: body.content,
      author: body.author,
      language: body.language || "english",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const poem: Poem = {
    id: data.id,
    title: data.title,
    content: data.content,
    author: data.author,
    language: data.language,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };

  return NextResponse.json(poem, { status: 201 });
}

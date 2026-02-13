import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { Poem } from "@/types";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();

  const { data, error } = await supabase
    .from("poems")
    .update({
      title: body.title,
      content: body.content,
      language: body.language,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
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

  return NextResponse.json(poem);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const { error } = await supabase.from("poems").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

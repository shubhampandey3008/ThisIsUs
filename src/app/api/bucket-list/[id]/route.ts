import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { BucketItem } from "@/types";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();

  const { data, error } = await supabase
    .from("bucket_list")
    .update({ completed: body.completed })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const item: BucketItem = {
    id: data.id,
    text: data.text,
    completed: data.completed,
    createdAt: data.created_at,
  };

  return NextResponse.json(item);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const { error } = await supabase.from("bucket_list").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

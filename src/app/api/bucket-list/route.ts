import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { BucketItem } from "@/types";

export async function GET() {
  const { data, error } = await supabase
    .from("bucket_list")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const items: BucketItem[] = (data ?? []).map((row) => ({
    id: row.id,
    text: row.text,
    completed: row.completed,
    createdAt: row.created_at,
  }));

  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const body = await request.json();

  const { data, error } = await supabase
    .from("bucket_list")
    .insert({ text: body.text })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const item: BucketItem = {
    id: data.id,
    text: data.text,
    completed: data.completed,
    createdAt: data.created_at,
  };

  return NextResponse.json(item, { status: 201 });
}

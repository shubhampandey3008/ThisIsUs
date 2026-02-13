import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { Memory } from "@/types";

export async function GET() {
  const { data, error } = await supabase
    .from("memories")
    .select("*")
    .order("date", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const memories: Memory[] = (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    date: row.date,
    latitude: row.latitude,
    longitude: row.longitude,
    imageUrl: row.image_url,
  }));

  return NextResponse.json(memories);
}

export async function POST(request: Request) {
  const body = await request.json();

  const { data, error } = await supabase
    .from("memories")
    .insert({
      title: body.title,
      description: body.description,
      date: body.date,
      latitude: body.latitude,
      longitude: body.longitude,
      image_url: body.imageUrl,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const memory: Memory = {
    id: data.id,
    title: data.title,
    description: data.description,
    date: data.date,
    latitude: data.latitude,
    longitude: data.longitude,
    imageUrl: data.image_url,
  };

  return NextResponse.json(memory, { status: 201 });
}

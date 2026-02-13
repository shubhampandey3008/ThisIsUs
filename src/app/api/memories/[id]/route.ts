import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { Memory } from "@/types";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();

  // If the image changed, delete the old one from Supabase Storage
  const { data: existing } = await supabase
    .from("memories")
    .select("image_url")
    .eq("id", id)
    .single();

  if (existing && body.imageUrl && body.imageUrl !== existing.image_url) {
    const oldUrl: string = existing.image_url;
    if (oldUrl.includes("/storage/v1/object/public/uploads/")) {
      const fileName = oldUrl.split("/uploads/").pop();
      if (fileName) {
        await supabase.storage.from("uploads").remove([fileName]);
      }
    }
  }

  const { data, error } = await supabase
    .from("memories")
    .update({
      title: body.title,
      description: body.description,
      date: body.date,
      latitude: body.latitude ?? undefined,
      longitude: body.longitude ?? undefined,
      image_url: body.imageUrl ?? undefined,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
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

  return NextResponse.json(memory);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  // Delete associated image from Supabase Storage
  const { data: memory } = await supabase
    .from("memories")
    .select("image_url")
    .eq("id", id)
    .single();

  if (memory?.image_url?.includes("/storage/v1/object/public/uploads/")) {
    const fileName = memory.image_url.split("/uploads/").pop();
    if (fileName) {
      await supabase.storage.from("uploads").remove([fileName]);
    }
  }

  const { error } = await supabase.from("memories").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

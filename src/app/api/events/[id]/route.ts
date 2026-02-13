import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { CalendarEvent } from "@/types";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();

  const { data, error } = await supabase
    .from("events")
    .update({
      title: body.title,
      date: body.date,
      recurrence: body.recurrence,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const event: CalendarEvent = {
    id: data.id,
    title: data.title,
    date: data.date,
    recurrence: data.recurrence,
    createdAt: data.created_at,
  };

  return NextResponse.json(event);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const { error } = await supabase.from("events").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

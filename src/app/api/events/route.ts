import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { CalendarEvent } from "@/types";

export async function GET() {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const events: CalendarEvent[] = (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    date: row.date,
    recurrence: row.recurrence,
    createdAt: row.created_at,
  }));

  return NextResponse.json(events);
}

export async function POST(request: Request) {
  const body = await request.json();

  const { data, error } = await supabase
    .from("events")
    .insert({
      title: body.title,
      date: body.date,
      recurrence: body.recurrence || "one-time",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const event: CalendarEvent = {
    id: data.id,
    title: data.title,
    date: data.date,
    recurrence: data.recurrence,
    createdAt: data.created_at,
  };

  return NextResponse.json(event, { status: 201 });
}

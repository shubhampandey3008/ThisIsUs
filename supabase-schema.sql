-- ============================================================
-- Frames of Us — Supabase Schema
-- Run this in your Supabase project's SQL Editor (one-time setup)
-- ============================================================

-- ─── Memories ───────────────────────────────────────────────
CREATE TABLE memories (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title      TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  date       TIMESTAMPTZ NOT NULL,
  latitude   DOUBLE PRECISION NOT NULL,
  longitude  DOUBLE PRECISION NOT NULL,
  image_url  TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Poems ──────────────────────────────────────────────────
CREATE TABLE poems (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title      TEXT NOT NULL,
  content    TEXT NOT NULL,
  author     TEXT NOT NULL CHECK (author IN ('nikita', 'shubham')),
  language   TEXT NOT NULL DEFAULT 'english' CHECK (language IN ('english', 'hindi')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Events (calendar) ─────────────────────────────────────
CREATE TABLE events (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title      TEXT NOT NULL,
  date       DATE NOT NULL,
  recurrence TEXT NOT NULL DEFAULT 'one-time' CHECK (recurrence IN ('one-time', 'monthly', 'yearly')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Bucket List ────────────────────────────────────────────
CREATE TABLE bucket_list (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text       TEXT NOT NULL,
  completed  BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Storage bucket for image uploads ───────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

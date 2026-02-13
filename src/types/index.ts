/* ─── Shared domain types ─── */

export type Memory = {
  id: string;
  title: string;
  description: string;
  date: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
};

export type Poem = {
  id: string;
  title: string;
  content: string;
  author: "nikita" | "shubham";
  language: "english" | "hindi";
  createdAt: string;
  updatedAt: string;
};

export type CalendarEvent = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  recurrence: "one-time" | "monthly" | "yearly";
  createdAt: string;
};

export type BucketItem = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
};

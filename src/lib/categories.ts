export type TodoCategory =
  | "work"
  | "personal"
  | "shopping"
  | "health"
  | "finance"
  | "learning"
  | "home"
  | "other";

export const TODO_CATEGORIES: TodoCategory[] = [
  "work",
  "personal",
  "shopping",
  "health",
  "finance",
  "learning",
  "home",
  "other",
];

export const CATEGORY_LABELS: Record<TodoCategory, string> = {
  work: "Work",
  personal: "Personal",
  shopping: "Shopping",
  health: "Health",
  finance: "Finance",
  learning: "Learning",
  home: "Home",
  other: "Other",
};

export const CATEGORY_STYLES: Record<TodoCategory, string> = {
  work: "bg-blue-100 text-blue-700",
  personal: "bg-purple-100 text-purple-700",
  shopping: "bg-pink-100 text-pink-700",
  health: "bg-emerald-100 text-emerald-700",
  finance: "bg-teal-100 text-teal-700",
  learning: "bg-indigo-100 text-indigo-700",
  home: "bg-orange-100 text-orange-700",
  other: "bg-zinc-100 text-zinc-600",
};

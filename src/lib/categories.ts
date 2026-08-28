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

// Hex equivalents of CATEGORY_STYLES, for use where Tailwind classes can't
// style an element (e.g. native <option> background/text colors).
export const CATEGORY_COLORS: Record<
  TodoCategory,
  { bg: string; text: string }
> = {
  work: { bg: "#dbeafe", text: "#1d4ed8" },
  personal: { bg: "#f3e8ff", text: "#7e22ce" },
  shopping: { bg: "#fce7f3", text: "#be185d" },
  health: { bg: "#d1fae5", text: "#047857" },
  finance: { bg: "#ccfbf1", text: "#0f766e" },
  learning: { bg: "#e0e7ff", text: "#4338ca" },
  home: { bg: "#ffedd5", text: "#c2410c" },
  other: { bg: "#f4f4f5", text: "#52525b" },
};

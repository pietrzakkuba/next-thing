import type { TodoCategory } from "@/lib/categories";

export type TodoPriority = "low" | "medium" | "high";

export type TodoUpdate = {
  title: string;
  dueDate: string | null;
  priority: TodoPriority;
  category: TodoCategory;
};

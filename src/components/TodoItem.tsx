import {
  CATEGORY_LABELS,
  CATEGORY_STYLES,
  type TodoCategory,
} from "@/lib/categories";

export type TodoPriority = "low" | "medium" | "high";

const PRIORITY_STYLES: Record<TodoPriority, string> = {
  low: "bg-zinc-100 text-zinc-600",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-red-100 text-red-700",
};

const PRIORITY_LABELS: Record<TodoPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

type TodoItemProps = {
  title: string;
  completed: boolean;
  dueDate: string | null;
  priority: TodoPriority;
  category: TodoCategory;
  onToggle: () => void;
  onDelete: () => void;
};

function formatDueDate(dueDate: string) {
  const date = new Date(`${dueDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dueDate;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function TodoItem({
  title,
  completed,
  dueDate,
  priority,
  category,
  onToggle,
  onDelete,
}: TodoItemProps) {
  return (
    <article className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3">
      <input
        type="checkbox"
        checked={completed}
        onChange={onToggle}
        className="h-4 w-4 rounded border-zinc-300"
      />
      <div className="flex flex-1 flex-col gap-1">
        <p
          className={
            completed ? "text-zinc-400 line-through" : "text-zinc-900"
          }
        >
          {title}
        </p>
        <div className="flex items-center gap-2 text-xs">
          <span
            className={`rounded-full px-2 py-0.5 font-medium ${PRIORITY_STYLES[priority]}`}
          >
            {PRIORITY_LABELS[priority]}
          </span>
          <span
            className={`rounded-full px-2 py-0.5 font-medium ${CATEGORY_STYLES[category]}`}
          >
            {CATEGORY_LABELS[category]}
          </span>
          {dueDate && (
            <span className="text-zinc-400">Due {formatDueDate(dueDate)}</span>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={onDelete}
        aria-label={`Delete "${title}"`}
        className="cursor-pointer text-sm text-zinc-400 transition hover:text-red-600"
      >
        Delete
      </button>
    </article>
  );
}

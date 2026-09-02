import { useState } from "react";
import {
  CATEGORY_LABELS,
  CATEGORY_STYLES,
  type TodoCategory,
} from "@/lib/categories";
import type { TodoPriority, TodoUpdate } from "@/lib/todos";
import TodoForm from "./TodoForm";

export type { TodoPriority, TodoUpdate } from "@/lib/todos";

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
  onEdit: (update: TodoUpdate) => void;
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
  onEdit,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);

  function startEditing() {
    setIsEditing(true);
  }

  function cancelEditing() {
    setIsEditing(false);
  }

  function saveEditing(
    draftTitle: string,
    draftDueDate: string | null,
    draftPriority: TodoPriority,
    draftCategory: TodoCategory
  ) {
    onEdit({
      title: draftTitle,
      dueDate: draftDueDate,
      priority: draftPriority,
      category: draftCategory,
    });
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <TodoForm
        initialTitle={title}
        initialDueDate={dueDate}
        initialPriority={priority}
        initialCategory={category}
        titlePlaceholder="Title"
        submitLabel="Save"
        onSubmitAction={saveEditing}
        onCancelAction={cancelEditing}
        autoFocus
      />
    );
  }

  return (
    <article className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800">
      <input
        type="checkbox"
        checked={completed}
        onChange={onToggle}
        className="h-4 w-4 rounded border-zinc-300 dark:border-zinc-600"
      />
      <div className="flex flex-1 flex-col gap-1">
        <p
          className={
            completed
              ? "text-zinc-400 line-through dark:text-zinc-500"
              : "text-zinc-900 dark:text-zinc-100"
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
            <span className="text-zinc-400 dark:text-zinc-500">
              Due {formatDueDate(dueDate)}
            </span>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={startEditing}
        aria-label={`Edit "${title}"`}
        className="cursor-pointer text-sm text-zinc-400 transition hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-100"
      >
        Edit
      </button>
      <button
        type="button"
        onClick={onDelete}
        aria-label={`Delete "${title}"`}
        className="cursor-pointer text-sm text-zinc-400 transition hover:text-red-600 dark:text-zinc-500 dark:hover:text-red-400"
      >
        Delete
      </button>
    </article>
  );
}

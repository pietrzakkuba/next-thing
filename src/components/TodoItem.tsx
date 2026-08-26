import { useState } from "react";
import {
  CATEGORY_LABELS,
  CATEGORY_STYLES,
  TODO_CATEGORIES,
  type TodoCategory,
} from "@/lib/categories";

export type TodoPriority = "low" | "medium" | "high";

export type TodoUpdate = {
  title: string;
  dueDate: string | null;
  priority: TodoPriority;
  category: TodoCategory;
};

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
  const [draftTitle, setDraftTitle] = useState(title);
  const [draftDueDate, setDraftDueDate] = useState(dueDate ?? "");
  const [draftPriority, setDraftPriority] = useState<TodoPriority>(priority);
  const [draftCategory, setDraftCategory] = useState<TodoCategory>(category);

  function startEditing() {
    setDraftTitle(title);
    setDraftDueDate(dueDate ?? "");
    setDraftPriority(priority);
    setDraftCategory(category);
    setIsEditing(true);
  }

  function cancelEditing() {
    setIsEditing(false);
  }

  function saveEditing() {
    const trimmedTitle = draftTitle.trim();
    if (!trimmedTitle) return;

    onEdit({
      title: trimmedTitle,
      dueDate: draftDueDate || null,
      priority: draftPriority,
      category: draftCategory,
    });
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <article className="flex flex-col gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-3">
        <input
          type="text"
          value={draftTitle}
          onChange={(event) => setDraftTitle(event.target.value)}
          placeholder="Title"
          className="rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-zinc-950"
        />
        <div className="flex flex-wrap gap-2">
          <input
            type="date"
            value={draftDueDate}
            onChange={(event) => setDraftDueDate(event.target.value)}
            aria-label="Due date"
            className="rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none transition focus:border-zinc-950"
          />
          <select
            value={draftPriority}
            onChange={(event) =>
              setDraftPriority(event.target.value as TodoPriority)
            }
            aria-label="Priority"
            className="rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none transition focus:border-zinc-950"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <select
            value={draftCategory}
            onChange={(event) =>
              setDraftCategory(event.target.value as TodoCategory)
            }
            aria-label="Category"
            className="rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none transition focus:border-zinc-950"
          >
            {TODO_CATEGORIES.map((value) => (
              <option key={value} value={value}>
                {CATEGORY_LABELS[value]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={cancelEditing}
            className="cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-500 transition hover:text-zinc-900"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={saveEditing}
            disabled={!draftTitle.trim()}
            className={`rounded-lg bg-zinc-950 px-3 py-1.5 text-sm font-medium text-white transition ${
              draftTitle.trim()
                ? "cursor-pointer hover:bg-zinc-800"
                : "cursor-not-allowed opacity-40"
            }`}
          >
            Save
          </button>
        </div>
      </article>
    );
  }

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
        onClick={startEditing}
        aria-label={`Edit "${title}"`}
        className="cursor-pointer text-sm text-zinc-400 transition hover:text-zinc-900"
      >
        Edit
      </button>
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
